export const checkFileType = (file: File | null | undefined): boolean => {
    return !!file && file.type === 'application/pdf';
}