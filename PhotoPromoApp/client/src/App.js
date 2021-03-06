import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import { UserProfileProvider } from "./providers/UserProfileProvider";
import { GalleryProvider } from "./providers/GalleryProvider";
import { PhotoProvider } from './providers/PhotoProvider';
import { ImageProvider } from './providers/ImageProvider';
import { WindowViewHandler } from './components/WindowViewHandler';
import { TopLevelView } from "./components/TopLevelView";

function App() {

  return (

    <Router>
      <UserProfileProvider>
        <ImageProvider>
          <GalleryProvider>
            <PhotoProvider>
              <WindowViewHandler >
                <TopLevelView />
              </WindowViewHandler>
            </PhotoProvider>
          </GalleryProvider>
        </ImageProvider>
      </UserProfileProvider>
    </Router>



  );
}

export default App;
