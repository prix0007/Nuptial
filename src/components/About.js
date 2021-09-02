import React from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import AboutMarkdown from '../README.md';


function About() {
    const [content, setContent] = React.useState("");

  React.useEffect(() => {
    fetch(AboutMarkdown)
      .then(res => res.text())
      .then(md => { setContent(md) })
  }, [])
  return (
    <div className="container mt-5 mb-5">
      <MarkdownPreview source={content} />
    </div>
  );
}

export default About;