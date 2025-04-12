import { isMobile } from "react-device-detect";
import MobileHome from "../pages/MobileHome"; 
import Authentication from "../components/Authentication";

function DeviceWrapper() {
  return isMobile ? <MobileHome /> : <Authentication />;
}

export default DeviceWrapper;