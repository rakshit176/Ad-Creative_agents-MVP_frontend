// @ts-nocheck
import React from 'react';
import { observer } from 'mobx-react-lite';
import { SectionTab } from 'polotno/side-panel';
import { Button } from '@blueprintjs/core';

// define the new custom section
export const GallerySection = {
  name: 'gallery',
  Tab: (props) => (
    <SectionTab name="Gallery" {...props}>
       {/* icon */}
       <p className="material-symbols-outlined mb-0 font-bold">gallery</p>
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: observer(({ store }) => {
    return (
      <div>
        <h3 style={{ marginBottom: '10px', marginTop: '5px' }}>Gallery</h3>
        <p>Images uploaded or generated from Product Studio / Model Studio </p>


        <Button className='bg-violetBg' fill intent="" style={{ borderRadius: "8px", color: "white", padding: "10px", marginTop: "20px", marginBottom: "20px" }}
          onClick={async () => {
            const src = "https://buffer.com/library/content/images/size/w1200/2023/10/free-images.jpg"

            store.activePage.addElement({
              type: 'jpg',
              name: 'Image',
              x: 50,
              y: 50,
              width: 200,
              height: 200,
              src,
            });
          }}
        >
           <span className='text-white'>Add Image</span>
        </Button>
      </div>
    );
  }),
};
