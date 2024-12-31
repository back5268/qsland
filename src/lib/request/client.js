export const createFormData = (body = {}, file, files, gallery, image, avatar, signature) => {
    const data = new FormData()
    if (file) {
        data.append("file", file)
    }
    if (avatar) {
        data.append("avatar", avatar)
    }
    if (files) {
        Object.keys(files).forEach((value) => {
            data.append(value, files[value])
        })
    }
    if (signature) {
        data.append("signature", signature)
    }
    if (gallery) {
        gallery.forEach(g => {
            data.append('gallery', g)
        })
    }
    if (image) {
        if (Array.isArray(image) && image[0]) {
            image.forEach(g => {
                data.append('image', g)
            })
        } else {
            data.append("image", image)
        }
    }
    Object.keys(body).forEach(key => {
        if (typeof body[key] === "object") data.append(key, JSON.stringify(body[key]))
        else if (body[key] || body[key] === 0 || body[key] === '') data.append(key, body[key])
    })
    return data
}
export const convertData = (body = {}) => {
    Object.keys(body).forEach(key => {
        if (typeof body[key] === "object") {
            body[key] = JSON.stringify(body[key])
        }
    })
    return body
}