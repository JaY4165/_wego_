export const getURL = () => {
    let url =
        process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : process?.env?.NEXT_PUBLIC_SITE_URL ??
            process?.env?.NEXT_PUBLIC_VERCEL_URL

    return url as string
}