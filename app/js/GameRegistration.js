class GameRegistration
{
    appProxy;
    container;
    formMsg;
    userList;

    constructor (AppProxy)
    {
        this.appProxy = AppProxy;
        this.container = document.getElementById('GameRegistration');
        this.formMsg = this.container.querySelector('.form-msg');
        this.btnSubmit = this.container.querySelector('button.btn-submit');
        this.btnHof = this.container.querySelector('button.btn-hof');
        this.setUserList();

        this.btnSubmit.addEventListener('click', () => this.setUser());
    }

    setUserList ()
    {
        fetch('backend/game.php?act=userList', {
            method : 'get',
            mode:    'cors',
            headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        })
            .then((res) => res.json())
            .then((data) => {
                this.userList = data;
                this.renderUserList();
            })
            .catch((error) => {
                if (typeof error !== 'undefined') {console.error("Error GameRegistrationRequest: " + error.message);}
            });
    }

    setUser ()
    {
        try {
            const formMsg = this.container.querySelector('.form-msg');
            const form = document.forms['formUser'];
            const formData = [];
            formData["act"] = "userForm";
            formData["name"] = form['name'].value.trim();
            formData["email"] = form['email'].value.trim();

            if (!this.checkFormData(formData)) {
                this.setMsg('Alle Felder benötigen einen Eintrag');
                return false;
            }
            this.setUserRequest(formData);

        } catch(error) {console.error("Error setUser: " + error.message)}
    }

    setUserRequest (formData)
    {
        try {
            fetch('backend/game.php', {
                method: 'post',
                body: JSON.stringify(GameUi.formPostData(formData)),
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            })
                .then((res) => res.json())
                .then((data) => {
                    this.setMsg(data?.msg);
                })
                .catch((error) => {
                    if (typeof error !== 'undefined') {
                        console.error("Error GameRegistrationRequest: " + error.message);
                    }
                });
        } catch(error) {console.error("Error GameRegistrationRequest: " + error.message)}
    }

    setMsg (msg)
    {
        this.formMsg.innerHTML = msg;
    }

    checkFormData (formData)
    {
        let result = true;
        for (let e in formData) {
            if (formData[e] === '') {
                result = false;
                break;
            }
        }

        return result;
    }

    renderUserList ()
    {
        const container = this.container.querySelector('tbody');
        if (container) {
            this.userList.map(user => {
                if (user['isActive'] === true) {
                    const row = document.createElement('tr');
                    const tdName = document.createElement('td');
                    const tdDate = document.createElement('td');
                    tdName.innerText = user['name'];
                    tdDate.innerText = user['date'];
                    row.append(tdName, tdDate);
                    container.append(row);
                }
            });
        }
    }
}