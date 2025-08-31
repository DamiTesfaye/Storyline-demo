const createElement = (htmlString: string): ChildNode | null => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();
  return div.firstChild;
};

export default createElement;
