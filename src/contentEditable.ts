export function parseContentEditable(childNodes: NodeListOf<ChildNode>) {
  let newValue = "";
  let isOnFreshLine = true;

  // Recursive function to navigate childNodes and build linebreaks with text
  function parseChildNodesForValueAndLines(childNodes: NodeListOf<ChildNode>) {
    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];

      if (childNode.nodeName === "BR") {
        // BRs are always line breaks which means the next loop is on a fresh line
        newValue += "\n";
        isOnFreshLine = true;
        continue;
      }

      // We may or may not need to create a new line
      if (childNode.nodeName === "DIV" && isOnFreshLine === false) {
        // Divs create new lines for themselves if they aren't already on one
        newValue += "\n";
      }

      // Whether we created a new line or not, we'll use it for this content so the next loop will not be on a fresh line:
      isOnFreshLine = false;

      // Add the text content if this is a text node:
      if (childNode.nodeType === 3 && childNode.textContent) {
        newValue += childNode.textContent;
      }

      // If this node has children, get into them as well:
      parseChildNodesForValueAndLines(childNode.childNodes);
    }
  }
  parseChildNodesForValueAndLines(childNodes);
  return newValue;
}
