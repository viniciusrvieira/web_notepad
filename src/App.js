import Navigation from './components/Navigation/index';
import File from './components/File/index';
import { useState } from 'react';

function App() {
  // Global states
  const [fileDetails, setFileDetails] = useState({ name: '', content: '' });
  const [fileDisplay, setFileDisplay] = useState('none');
  const [url, setUrl] = useState('/');

  return (
    <section>
      <Navigation
        url={url}
        setUrl={setUrl}
        setFileDisplay={setFileDisplay}
        setFileDetails={setFileDetails}
      />
      <File
        url={url}
        setFileDetails={setFileDetails}
        setFileDisplay={setFileDisplay}
        fileDisplay={fileDisplay}
        fileDetails={fileDetails}
      />
    </section>
  );
}

export default App;
