import {
    maxFileSizeInMBForUploadImage,
} from "./common";

export function imageUploadHandler(event, setFormData, pathFieldName, fileFieldName, maxFileSize = maxFileSizeInMBForUploadImage) {
    return _fileUploadHandler("image", maxFileSize, event, setFormData, pathFieldName, fileFieldName);
}

function _fileUploadHandler(mediaType, maxUploadSize, event, setFormData, pathFieldName, fileFieldName) {
    const fileList = event.target.files;

    if (fileList?.[0]?.size === undefined) {
        // Reset the value so that onChange get trigger again even for the same image file.
        event.target.value = "";
        return;
    } else if (fileList[0].size > (maxUploadSize * 1024 * 1024)) {
        // Reset the value so that onChange get trigger again even for the same image file.
        event.target.value = "";
        alert("Sorry, maximum allowed upload size for the upload is " + maxUploadSize + " MB");
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const result = reader.result;
        /**
         * FileReader.readyState
         * EMPTY	0	No data has been loaded yet.
         * LOADING	1	Data is currently being loaded.
         * DONE     2	The entire read request has been completed.
         */
        if (reader.readyState === 2) {
            const callback = (duration = null) => {
                const newFormData = {
                    new_upload: true,
                    [pathFieldName]: fileList[0].name,
                    [fileFieldName]: result,
                };

                setFormData(newFormData);
            }

            callback();
        }
    }

    reader.readAsDataURL(fileList[0]);
}
