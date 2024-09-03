// @ts-nocheck
import { observer } from 'mobx-react-lite';
// import {
//   Navbar,
//   Alignment,
//   EditableText,
// } from '@blueprintjs/core';

// import styled from 'polotno/utils/styled';

import { useProject } from '../project';
import Header from '../../Header';
import { adStudio } from '../../../assets/defaultStrings';
import { DownloadButton } from './download-button';

// import { FileMenu } from './file-menu';


// const NavbarContainer = styled('div')`
//   white-space: nowrap;

//   @media screen and (max-width: 500px) {
//     overflow-x: auto;
//     overflow-y: hidden;
//     max-width: 100vw;
//   }
// `;

// const NavInner = styled('div')`
//   @media screen and (max-width: 500px) {
//     display: flex;
//   }
// `;



export default observer(({ store }) => {
  const project = useProject();

  return (
    <>
      <Header location={adStudio} />
      <div className="absolute top-32 end-6 z-50">
        <DownloadButton store={store} />
      </div>
    </>
    // <NavbarContainer className="bp5-navbar">
    //   <NavInner>
    //     <Navbar.Group align={Alignment.LEFT}>
    //       <FileMenu store={store} project={project} />
    //       <div
    //         style={{
    //           paddingLeft: '20px',
    //           maxWidth: '200px',
    //         }}
    //       >
    //         <EditableText
    //           value={window.project.name}
    //           placeholder="Design name"
    //           onChange={(name) => {
    //             window.project.name = name;
    //             window.project.requestSave();
    //           }}
    //         />
    //       </div>
    //     </Navbar.Group>
    //     {/* <Navbar.Group align={Alignment.RIGHT}>
    //       <Status project={project} />

    //       <AnchorButton
    //         href="https://polotno.com"
    //         target="_blank"
    //         minimal
    //         icon={
    //           <BiCodeBlock className="bp5-icon" style={{ fontSize: '20px' }} />
    //         }
    //       >
    //         API
    //       </AnchorButton>

    //       <AnchorButton
    //         minimal
    //         href="https://discord.gg/W2VeKgsr9J"
    //         target="_blank"
    //         icon={
    //           <FaDiscord className="bp5-icon" style={{ fontSize: '20px' }} />
    //         }
    //       >
    //         Join Chat
    //       </AnchorButton>
    //       <AnchorButton
    //         minimal
    //         href="https://github.com/lavrton/polotno-studio"
    //         target="_blank"
    //         icon={
    //           <FaGithub className="bp5-icon" style={{ fontSize: '20px' }} />
    //         }
    //       ></AnchorButton>
    //       <AnchorButton
    //         minimal
    //         href="https://twitter.com/lavrton"
    //         target="_blank"
    //         icon={
    //           <FaTwitter className="bp5-icon" style={{ fontSize: '20px' }} />
    //         }
    //       ></AnchorButton>
    //       <NavbarDivider />
    //       <PlayButton store={store} />
    //       <DownloadButton store={store} />
    //       <UserMenu store={store} project={project} />
    //     </Navbar.Group> */}
    //   </NavInner>
    // </NavbarContainer>
  );
});
