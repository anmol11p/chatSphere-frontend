import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ChakraProvider } from "@chakra-ui/react";

import { Provider } from "react-redux";
import store from "./Redux/Store.js";
import ChatProvider from "./Context/ChatProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Provider for Redux needs to wrap components using useSelector */}
    <Provider store={store}>
      {/* Chakra UI Provider */}
      <ChakraProvider>
        {/* ChatProvider is now inside Redux Provider so it can use useSelector */}
        <ChatProvider>
          <App />
          {/* ToastContainer for notifications */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </ChatProvider>
      </ChakraProvider>
    </Provider>
  </StrictMode>
);
