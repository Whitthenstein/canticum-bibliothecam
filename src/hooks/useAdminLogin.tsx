import { checkPassword } from "@/actions/adminActions";
import { useStore } from "@/store/store";

const useAdminLogin = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

  const submitPasswordAndCheck = async (password: string) => {
    if (password.length === 0) {
      return false;
    }

    const isPasswordCorrect = await checkPassword(password);

    if (isPasswordCorrect) {
      setIsAuthenticated(true);
      return true;
    }

    return false;
  };

  return { isAuthenticated, submitPasswordAndCheck };
};

export default useAdminLogin;
