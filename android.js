var language;

function generateAndroidStringFile(conversionFile, language) {
	this.language = language;
	var xmlDoc = jQuery.parseXML(conversionFile);
	var date = moment().format("MMMM Do YYYY, h:mm:ss a");
	var stringXML = '<?xml version="1.0" encoding="utf-8"?> \n  <!-- generation time : ' + date + '--> \n<resources>\n';
	for (var index = 0; index < xmlDoc.children[0].children.length; index++) {
		stringXML += (index > 0 ? "\n" : "") + readSectionForAndroidXML(xmlDoc.children[0].children[index]);
	}

	stringXML += '</resources>';
	return stringXML;
}

function readSectionForAndroidXML(section) {
	var sectionXML = section.getAttribute("id").length == 0 ? "" :'<!-- ' + section.getAttribute("id") + ' -->\n';
	for (var index = 0; index < section.children.length; index++) {
		var string = section.children[index];
		if (string.getAttribute("target") == "Mobile" || string.getAttribute("target") == "Android") {
			if (section.children[index].getElementsByTagName(language)[0].childNodes.length == 1) {
				sectionXML += '    <string name="' + string.getAttribute("id") + '">' + xmlToAndroidXmlString(string.getElementsByTagName(this.language)[0].childNodes[0].nodeValue) + '</string>\n';
			} else {
				var single = string.getElementsByTagName(language)[0].getElementsByTagName("one")[0].childNodes[0].nodeValue;
				var plural = string.getElementsByTagName(language)[0].getElementsByTagName("many")[0].childNodes[0].nodeValue;

				var pluralsXml = '    <plurals name="' + section.children[index].getAttribute("id") + '">';
				pluralsXml += '\n        <item quantity="one">' + xmlToAndroidXmlString(single) + '</item>';
				pluralsXml += '\n        <item quantity="other">' + xmlToAndroidXmlString(plural) + '</item>';
				pluralsXml += '\n    </plurals>\n';
				sectionXML += pluralsXml;
			}

		}
	}
	return sectionXML;
}

/* Will change all the {{number}} for %d and {{text}} for %s*/
function xmlToAndroidXmlString(unformattedString) {
	var numberFormattedString = numberFormat(unformattedString);
	var stringFormatted = textFormat(numberFormattedString);
	return stringFormatted.replaceAll("'", "\\'").toXmlFormat();
}

function numberFormat(unformattedString) {
	return formatString(unformattedString, '{{number}}', 'd');
}

function textFormat(unformattedString) {
	return formatString(unformattedString, '{{text}}', 's');
}

function formatString(unformattedString, oldPattern, newPattern) {
	var splittedStrings = unformattedString.split(oldPattern);
	var formattedString = "";

	for (var index = 0; index < splittedStrings.length - 1; index++) {
		var formattedVariable = '%' + (index + 1) + '$' + newPattern;
		formattedString += splittedStrings[index];
		formattedString += formattedVariable;
	}
	formattedString += splittedStrings[splittedStrings.length - 1];
	return formattedString;
}