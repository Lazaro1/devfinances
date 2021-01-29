const Modal = {
    OpenModal() {
        document.querySelector('.modal-overlay').classList.add('active')
    },
    CloseModal(){
        document.querySelector('.modal-overlay').classList.remove('active')
    }
}