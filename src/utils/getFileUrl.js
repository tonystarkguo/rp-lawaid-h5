const readerOnload = (event) => {
  return new Promise((resolve) => {
    const fileType = event.target.files[0].type
    if (fileType.indexOf('image') > -1) {
      const reader = new FileReader()
      reader.readAsDataURL(event.target.files[0])
      reader.onload = function (e) {
        resolve(e.target.result)
      }
    } else {
      resolve('')
    }
  })
}
export async function getFileUrl (event) {
  let url = await readerOnload(event)
  return url
}
