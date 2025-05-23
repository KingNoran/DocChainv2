export const checkMetaMask = (): boolean => {
    if (typeof window === "undefined" || !window.ethereum) {
        alert("No Metamask Detected. Please install Metamask!");
        return false;
    }
    return true;
};