import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

export const FormattedMessage = ({ content }) => {
  /**
   * Recursively parses inline formatting in a text string.
   * It handles:
   *  - ***text*** → bold + italic
   *  - **text** → bold
   *  - *text* → italic
   *  - `text` → inline code
   */
  const parseInlineText = (text) => {
    const elements = [];
    let remaining = text;
    let keyIndex = 0;

    // Regular expressions for our inline styles.
    const tripleRegex = /\*\*\*(.*?)\*\*\*/;
    const doubleRegex = /\*\*(.*?)\*\*/;
    const singleRegex = /\*(?!\*)(.*?)\*/; // negative lookahead to avoid ** match
    const codeRegex = /`(.*?)`/;

    while (remaining) {
      const tripleRes = tripleRegex.exec(remaining);
      const doubleRes = doubleRegex.exec(remaining);
      const singleRes = singleRegex.exec(remaining);
      const codeRes = codeRegex.exec(remaining);
      const candidates = [];

      if (tripleRes) {
        candidates.push({ index: tripleRes.index, type: 'triple', match: tripleRes });
      }
      if (doubleRes) {
        candidates.push({ index: doubleRes.index, type: 'double', match: doubleRes });
      }
      if (singleRes) {
        candidates.push({ index: singleRes.index, type: 'single', match: singleRes });
      }
      if (codeRes) {
        candidates.push({ index: codeRes.index, type: 'code', match: codeRes });
      }

      // If no formatting found, just push the rest of the text.
      if (candidates.length === 0) {
        elements.push(<Text key={keyIndex++}>{remaining}</Text>);
        break;
      }

      // Sort candidates so that the earliest match is handled first.
      candidates.sort((a, b) => a.index - b.index);
      const candidate = candidates[0];

      // Push any plain text before the match.
      if (candidate.index > 0) {
        elements.push(<Text key={keyIndex++}>{remaining.slice(0, candidate.index)}</Text>);
      }

      const innerText = candidate.match[1];
      // Create a styled Text component for the matched text.
      if (candidate.type === 'triple') {
        elements.push(
          <Text key={keyIndex++} style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
            {parseInlineText(innerText)}
          </Text>
        );
      } else if (candidate.type === 'double') {
        elements.push(
          <Text key={keyIndex++} style={{ fontWeight: 'bold' }}>
            {parseInlineText(innerText)}
          </Text>
        );
      } else if (candidate.type === 'single') {
        elements.push(
          <Text key={keyIndex++} style={{ fontStyle: 'italic' }}>
            {parseInlineText(innerText)}
          </Text>
        );
      } else if (candidate.type === 'code') {
        elements.push(
          <Text key={keyIndex++} style={styles.inlineCode}>
            {innerText}
          </Text>
        );
      }

      // Update the remaining text after the matched portion.
      remaining = remaining.slice(candidate.index + candidate.match[0].length);
    }

    return elements;
  };

  /**
   * Processes the full content string, splitting it by lines and handling:
   *  - Headings (levels 1–3)
   *  - Code blocks (delimited by triple backticks)
   *  - Unordered and ordered lists
   *  - Paragraphs
   */
  const formatContent = (text) => {
    const lines = text.split('\n').map(line => line.replace(/\r$/, ''));
    const formattedSections = [];
    let currentSection = null;
    let inCodeBlock = false;
    let codeLanguage = ''; // For compatibility, though unused here

    const closeCurrentSection = () => {
      if (!currentSection) return;
      if (currentSection.type === 'paragraph') {
        formattedSections.push(
          <Text key={`p-${formattedSections.length}`} style={styles.paragraph}>
            {parseInlineText(currentSection.content.join(' '))}
          </Text>
        );
      } else if (currentSection.type === 'code') {
        formattedSections.push(
          <ScrollView
            key={`code-${formattedSections.length}`}
            horizontal
            style={styles.codeBlock}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <Text style={styles.codeText}>
              {currentSection.content.join('\n')}
            </Text>
          </ScrollView>
        );
      } else if (currentSection.type === 'unordered-list') {
        formattedSections.push(
          <View key={`ul-${formattedSections.length}`} style={styles.listContainer}>
            {currentSection.items.map((item, idx) => (
              <View key={idx} style={[styles.listItem, { marginLeft: currentSection.level * 10 }]}>
                <Text style={styles.bullet}>• </Text>
                <Text style={styles.listItemText}>{parseInlineText(item)}</Text>
              </View>
            ))}
          </View>
        );
      } else if (currentSection.type === 'ordered-list') {
        formattedSections.push(
          <View key={`ol-${formattedSections.length}`} style={styles.listContainer}>
            {currentSection.items.map((item, idx) => (
              <View key={idx} style={[styles.listItem, { marginLeft: currentSection.level * 10 }]}>
                <Text style={styles.bullet}>{idx + 1}. </Text>
                <Text style={styles.listItemText}>{parseInlineText(item)}</Text>
              </View>
            ))}
          </View>
        );
      }
      currentSection = null;
    };

    lines.forEach((line) => {
      const trimmedLine = line.trimEnd();
      const indentMatch = line.match(/^(\s*)/);
      const indentSize = indentMatch ? indentMatch[1].length : 0;

      // Check for code block delimiters (```language)
      const codeBlockMatch = trimmedLine.match(/^```(\w*)$/);
      if (codeBlockMatch) {
        if (!inCodeBlock) {
          closeCurrentSection();
          inCodeBlock = true;
          codeLanguage = codeBlockMatch[1];
          currentSection = { type: 'code', content: [] };
        } else {
          inCodeBlock = false;
          closeCurrentSection();
          codeLanguage = '';
        }
        return;
      }
      if (inCodeBlock && currentSection?.type === 'code') {
        currentSection.content.push(line);
        return;
      }

      // Handle headings:
      if (/^#\s+/.test(trimmedLine)) {
        closeCurrentSection();
        formattedSections.push(
          <Text key={`h1-${formattedSections.length}`} style={styles.h1}>
            {parseInlineText(trimmedLine.replace(/^#\s+/, ''))}
          </Text>
        );
      } else if (/^##\s+/.test(trimmedLine)) {
        closeCurrentSection();
        formattedSections.push(
          <Text key={`h2-${formattedSections.length}`} style={styles.h2}>
            {parseInlineText(trimmedLine.replace(/^##\s+/, ''))}
          </Text>
        );
      } else if (/^###\s+/.test(trimmedLine)) {
        closeCurrentSection();
        formattedSections.push(
          <Text key={`h3-${formattedSections.length}`} style={styles.h3}>
            {parseInlineText(trimmedLine.replace(/^###\s+/, ''))}
          </Text>
        );
      }
      // Handle unordered lists (lines starting with *, -, or •)
      else if (/^\s*[\*\-•]\s+/.test(trimmedLine)) {
        const nestLevel = Math.floor(indentSize / 2);
        if (!currentSection || currentSection.type !== 'unordered-list' || currentSection.level !== nestLevel) {
          closeCurrentSection();
          currentSection = {
            type: 'unordered-list',
            items: [],
            level: nestLevel,
          };
        }
        const listItemContent = trimmedLine.replace(/^\s*[\*\-•]\s+/, '');
        currentSection.items.push(listItemContent);
      }
      // Handle ordered lists (lines starting with 1., 2., etc.)
      else if (/^\s*\d+\.\s+/.test(trimmedLine)) {
        const nestLevel = Math.floor(indentSize / 2);
        if (!currentSection || currentSection.type !== 'ordered-list' || currentSection.level !== nestLevel) {
          closeCurrentSection();
          currentSection = {
            type: 'ordered-list',
            items: [],
            level: nestLevel,
          };
        }
        const listItemContent = trimmedLine.replace(/^\s*\d+\.\s+/, '');
        currentSection.items.push(listItemContent);
      }
      // Regular paragraph lines
      else if (trimmedLine.trim()) {
        if (!currentSection || currentSection.type !== 'paragraph') {
          closeCurrentSection();
          currentSection = { type: 'paragraph', content: [] };
        }
        currentSection.content.push(trimmedLine);
      }
      // If the line is empty, close the current section.
      else {
        closeCurrentSection();
      }
    });
    closeCurrentSection();

    return formattedSections;
  };

  return <View style={styles.container}>{formatContent(content)}</View>;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  paragraph: {
    color: '#4a5568', // equivalent to text-gray-700
    marginBottom: 16,
    lineHeight: 22,
    fontSize: 16,
  },
  h1: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c', // equivalent to text-gray-900
    marginTop: 24,
    marginBottom: 16,
  },
  h2: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3748', // equivalent to text-gray-800
    marginTop: 20,
    marginBottom: 12,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a5568', // equivalent to text-gray-700
    marginTop: 16,
    marginBottom: 8,
  },
  codeBlock: {
    backgroundColor: '#f9fafb', // equivalent to bg-gray-50
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0', // equivalent to border-gray-200
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#2d3748',
  },
  inlineCode: {
    backgroundColor: '#f3f3f3',
    paddingHorizontal: 4,
    borderRadius: 4,
    fontFamily: 'monospace',
  },
  listContainer: {
    marginVertical: 8,
    paddingLeft: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bullet: {
    marginRight: 4,
    fontSize: 16,
    color: '#4a5568',
  },
  listItemText: {
    flex: 1,
    color: '#4a5568',
    fontSize: 16,
    lineHeight: 22,
  },
});
