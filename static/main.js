let goBack = () => {
    if (document.referrer == "") {
        window.location.href="https://mattbanister.github.io"
    } else {
        window.history.go(-1)
    }
    return false
}