export default async function LocaleFile({ locale }) {
    let jsonFile = "en.json";
    if (locale === "ko") {
        jsonFile = "ko.json";
    }

    const messages = await import(`../../../../public/locales/${jsonFile}`)
        .then((mod) => mod.default)
        .catch((err) => {
            console.error("Import Error:", err);
            return null;
        });

    return messages;
};