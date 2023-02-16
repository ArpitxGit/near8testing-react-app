import React, { useEffect, useState } from "react";
import { CupertinoPane } from "cupertino-pane";
import classNames from "classnames";

let paneNum = 0;

const CupertinoPaneContainer = ({
  parentClass,
  refreshToken,
  initCallback,
  children,
}) => {
  const [className] = useState(paneNum);
  const [drawer, setDrawer] = useState(null);
  if (className === paneNum) paneNum++;

  useEffect(() => {
    if (!drawer) {
      setDrawer(
        new CupertinoPane(
          ".cupertinoPane" + className, // Pane container selector
          {
            darkMode: true,
            bottomClose: false,
            fastSwipeClose: false,
            lowerThanBottom: true,
            buttonClose: false,
            // bottomOffset: 60,
            initialBreak: "bottom",
            breaks: {
              top: { enabled: true, height: 700 },
              middle: { enabled: true, height: 400, bounce: true },
              bottom: { enabled: true, height: 60 },
            },
            // draggableOver: true,
            // dragByCursor: false,
            // backdrop: true,
            topperOverflow: false,
            topperOverflowOffset: 110,
            // followerElement: 'ion-fab',
            // onDrag: () => console.log('Drag event'),
            // freeMode: true,
            // onBackdropTap: () => hideDrawer()
            events: {
              onWillPresent: () => {
                initCallback?.();
                console.log("will present");
              },
              onDidPresent: () => {
                initCallback?.();
                console.log("did present");
              },
            },
          }
        )
      );

      console.log("setDrawer");

      initCallback?.();
    } else {
      setTimeout(() => {
        drawer.present({ animate: true });
      });
    }
  }, [drawer, parentClass, className]);

  useEffect(() => {
    if (drawer) {
      if (!drawer.isPanePresented()) {
        drawer.present({ animate: true });
      } else if (drawer.isHidden()) drawer.moveToBreak("middle");
    }
  }, [refreshToken, drawer]);

  return (
    <div className={classNames("cupertinoPane" + className, "py-4")}>
      {children}
    </div>
  );
};

export default CupertinoPaneContainer;
