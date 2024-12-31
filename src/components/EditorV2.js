import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

// Documentation: https://www.tiny.cloud/docs/integrations/react/

const TinyMceEditor = (props) => {
  const { initData, data, setData = () => {} } = props;

  const onEditorChange = (e, editor) => {
    setData(e);
  };

  return (
      <Editor
        apiKey="y7gnmtbsaxnjbgh3405ioqbdm24eit5f0ovek49w8yvq5r9q"
        initialValue={initData}
        init={{
          branding: false,
          height: 800,
          menubar: true,
          plugins:
            'print preview paste searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern',
          toolbar:
            'formatselect | bold italic underline strikethrough | forecolor backcolor blockquote | link image media | alignleft aligncenter alignright alignjustify | numlist bullist outdent indent | removeformat'
        }}
        value={data}
        onEditorChange={onEditorChange}
      />
  );
};

export default TinyMceEditor;
