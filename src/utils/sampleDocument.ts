export const SAMPLE_DOCUMENT_HTML = `
<h1>Product Requirements: Project Docs</h1>
<p>Docs is a <strong>modern, responsive, high-performance word processor</strong> designed for seamless web editing. It combines the familiar productivity ergonomics of classic document suites with a fast, distraction-free interface.</p>

<h2>1. Core Design Principles</h2>
<p>To provide a first-class writing environment, the interface is anchored around four key tenets:</p>
<ul>
  <li><strong>Instant Responsiveness:</strong> Zero lag during input, cursor repositioning, and formatting.</li>
  <li><strong>Restrained Visuals:</strong> Soft neutral canvases, high-contrast typography, and intuitive toolbars.</li>
  <li><strong>Document Structure:</strong> Automatic outline generation that reflects headings in real-time.</li>
  <li><strong>Offline-First Resilience:</strong> Automatic localStorage state persistence with debounced saving.</li>
</ul>

<h2>2. Formatting &amp; Styling Capabilities</h2>
<p>The editor supports comprehensive rich-text styling primitives, including <u>underlines</u>, <em>italics</em>, and <span style="background-color: #fef08a">custom color highlights</span>. Content can also be organized with structured blocks:</p>

<blockquote>
  "Good design is as little design as possible. Less, but better — because it concentrates on the essential aspects."
</blockquote>

<h3>Code &amp; Monospace Formatting</h3>
<p>For technical and specification documents, inline code and dedicated blocks are available:</p>
<pre><code>// Example Docs storage sync handler
const handleContentSave = (doc) => {
  localStorage.setItem('docs_doc', JSON.stringify(doc));
};</code></pre>

<h2>3. Next Milestones</h2>
<ol>
  <li>Multi-page dynamic pagination with print margins.</li>
  <li>Collaborative cursor synchronization and comments.</li>
  <li>Export to PDF and EPUB formats.</li>
</ol>
<p>Enjoy writing with <strong>Docs</strong>!</p>
`;
