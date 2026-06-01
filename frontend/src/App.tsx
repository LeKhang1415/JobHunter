import { Provider } from "react-redux";

import { persistor, store } from "./features/store";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { setupAxiosInterceptors } from "./lib/axiosClient";

setupAxiosInterceptors(store.dispatch);

function App() {
    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <RouterProvider router={router} />
            </PersistGate>
        </Provider>
    );
}

export default App;
