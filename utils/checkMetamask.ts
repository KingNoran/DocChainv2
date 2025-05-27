import { toast } from 'sonner';

export const checkMetaMask = (): boolean => {
    if (typeof window === "undefined" || !window.ethereum) {
        return false;
    }
    return true;
};