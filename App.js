import StackNavigator from "./StackNavigator";
import { UserContext } from "./context/UseContext";

const App = () => {
    return (
        <UserContext>
            <StackNavigator />
        </UserContext>
    );
};

export default App;
