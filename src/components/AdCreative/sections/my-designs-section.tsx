// @ts-nocheck
import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import {
  Button,
  Card,
  Menu,
  MenuItem,
  Position,
  Spinner,
  Popover,
} from '@blueprintjs/core';

// import { CloudWarning } from '../cloud-warning';

import { SectionTab } from 'polotno/side-panel';
// import FaFolder from '@meronex/icons/fa/FaFolder';
import { useProject } from '../project';
import * as api from '../api';
import { useSelector } from 'react-redux';
import { ReduxStateType } from '../../../types/reduxTypes';

const DesignCard = observer(({ design, store, onDelete }) => {
  const [loading, setLoading] = React.useState(false);
  const [previewURL, setPreviewURL] = React.useState(design.previewURL);

  React.useEffect(() => {
    const load = async () => {
      const url = await api.getPreview({ id: design.id });
      setPreviewURL(url);
    };
    load();
  }, []);

  const handleSelect = async () => {
    setLoading(true);
    window.project.loadById(design.id);
    setLoading(false);
  };

  return (
    <Card
      style={{ margin: '3px', padding: '0px', position: 'relative', borderRadius: "4px" }}
      interactive
      onClick={() => {
        handleSelect();
      }}
    >
      <img src={previewURL} style={{ width: '100%' }} />
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          padding: '3px',
        }}
      >
        {design.name}
      </div>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Spinner />
          <div className="spinner mx-auto my-11"> </div>
        </div>
      )}
      <div
        style={{ position: 'absolute', top: '5px', right: '5px' }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <Popover
          content={
            <Menu>
              <MenuItem
                icon="document-open"
                text="Open"
                onClick={() => {
                  handleSelect();
                }}
              />
              {/* <MenuItem
                icon="duplicate"
                text="Copy"
                onClick={async () => {
                  handleCopy();
                }}
              /> */}
              <MenuItem
                icon="trash"
                text="Delete"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete it?')) {
                    onDelete({ id: design.id });
                  }
                }}
              />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <Button icon="more" />
        </Popover>
      </div>
    </Card>
  );
});

export const MyDesignsPanel = observer(({ store }) => {
  const project = useProject();
  const [designsLoadings, setDesignsLoading] = React.useState(false);
  const [designs, setDesigns] = React.useState([]);

  const loadDesigns = async () => {
    setDesignsLoading(true);
    const list = await api.listDesigns();
    setDesigns(list);
    setDesignsLoading(false);
  };

  const handleProjectDelete = ({ id }) => {
    setDesigns(designs.filter((design) => design.id !== id));
    api.deleteDesign({ id });
  };

  React.useEffect(() => {
    loadDesigns();
  }, [project.cloudEnabled, project.designsLength]);

  const half1 = [];
  const half2 = [];

  designs.forEach((design, index) => {
    if (index % 2 === 0) {
      half1.push(design);
    } else {
      half2.push(design);
    }
  });

  const { uploadedImage, generatedImage, outpaintedImage, bgRemovedImage, adCreativeImport } = useSelector((state: ReduxStateType) => state.canvas)
  const [images, setImages] = React.useState([]);

  useEffect(() => {
    setImages([]);
    const imageArray = []
    if (generatedImage) imageArray.push({ title: "Generated Image", src: generatedImage });
    if (outpaintedImage) imageArray.push({ title: "Auto Filled Image", src: outpaintedImage });
    if (bgRemovedImage) imageArray.push({ title: "Background Removed", src: bgRemovedImage });
    if (uploadedImage) imageArray.push({ title: "Uploaded / Modified Image", src: uploadedImage });
    setImages(imageArray);
  }, [uploadedImage, generatedImage, outpaintedImage, bgRemovedImage]);


  useEffect(() => {
    if (adCreativeImport) addToCanvas(adCreativeImport)
  }, [])

  //---------- Add Image to Canvas ----------------

  const addToCanvas = (imageSRC: string) => {

    const base64Image = imageSRC?.split(',')[1];
    const img = new Image();
    img.onload = () => {
      // Get the dimensions of the image
      const width = img.width;
      const height = img.height;

      // Construct the SVG content with the dynamic dimensions
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}">
<image xlink:href="data:image/png;base64,${base64Image}" width="${width}" height="${height}"/>
</svg>`;

      // Convert the SVG content to a Blob
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml' });
      const svgURL = URL.createObjectURL(svgBlob);

      // Add the SVG element to the page
      store.activePage.addElement({
        type: 'svg',
        name: 'image',
        x: 50,
        y: 50,
        width: width, // Set width dynamically
        height: height, // Set height dynamically
        src: svgURL,
      });
    };
    img.src = 'data:image/png;base64,' + base64Image; // Set the source of the image

  }



  //==========================================================================================================
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'auto' }} >

      {images?.length ? <h6 className='text-sm font-semibold my-3'>Image Gallery</h6> : null}

      <div className="grid grid-cols-2 gap-[12px] md:grid-cols-2 mb-10">
        {images?.length ? images.map((image, index) => (

          <div key={index} className="mx-auto mb-1 hover:shadow-lg cursor-pointer text-center"
            onClick={() => addToCanvas(image?.src)} >
            <div className="image-container w-full h-full rounded ">
              <img src={image?.src} alt={image?.title} className="rounded" draggable />
            </div>
            <p className='text-xs'>{image?.title}</p>
          </div>

        )) : null}
      </div>

      <h6 className='text-sm font-semibold'>My Designs</h6>

      {!designsLoadings && !designs.length && (
        <div style={{ paddingTop: '20px', textAlign: 'center', opacity: 0.6 }}>
          You have no saved designs yet...
        </div>
      )}
      {designsLoadings && (
        <div style={{ padding: '30px' }}>
          <Spinner />
        </div>
      )}


      {/* designs preview */}
      <div style={{ display: 'flex', paddingTop: '5px', maxHeight: '50%', overflow: 'auto', }} >
        <div style={{ width: '50%' }}>
          {half1.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
        <div style={{ width: '50%' }}>
          {half2.map((design) => (
            <DesignCard
              design={design}
              key={design.id}
              store={store}
              onDelete={handleProjectDelete}
            />
          ))}
        </div>
      </div>

      <Button className='bg-violetBg' fill intent="" style={{ borderRadius: "8px", color: "white", padding: "10px", marginTop: "20px", marginBottom: "20px" }}
        onClick={async () => { project.createNewDesign(); }} >
        <span className='text-white'>Create new design</span>
      </Button>

    </div>
  );
});



// define the new custom section
export const MyDesignsSection = {
  name: 'my-designs',
  Tab: (props) => (
    <SectionTab name="My Designs" {...props}>
      {/* icon */}
      <p className="material-symbols-outlined mb-0 ">folder</p>
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: MyDesignsPanel,
};
