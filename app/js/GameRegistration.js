class GameRegistration
{
    appProxy;
    container;
    formMsg;
    userList;

    constructor (AppProxy, translationHandler)
    {
        this.appProxy = AppProxy;
        this.translationHandler = translationHandler;
        this.messageCode = null;
        this.container = document.getElementById('GameRegistration');
        this.formMsg = this.container.querySelector('.form-msg');
        this.btnSubmit = this.container.querySelector('button.btn-submit');
        this.btnHof = this.container.querySelector('button.btn-hof');
        this.translationHandler.onLanguageChange(() => this.updateTranslations());
        if (this.container.querySelector('tbody')) {
            this.setUserList();
        }

        if (this.btnSubmit) {
            this.btnSubmit.addEventListener('click', () => this.setUser());
        }
    }

    async setUserList ()
    {
        try {
            const response = await fetch('backend/game.php?act=userList');
            if (!response.ok) {throw new Error(`HTTP ${response.status}`);}
            const data = await response.json();
            if (!Array.isArray(data)) {throw new Error('Invalid user list response');}
            this.userList = data;
            this.renderUserList();
        } catch (error) {
            console.error('Error GameRegistrationRequest:', error);
            this.setMsg('listFailed');
        }
    }

    setUser ()
    {
        try {
            const form = document.forms['formUser'];
            const formData = [];
            formData["act"] = "userForm";
            formData["name"] = form['name'].value.trim();
            formData["email"] = form['email'].value.trim();

            if (!this.checkFormData(formData)) {
                this.setMsg('required');
                return false;
            }
            this.setUserRequest(formData);

        } catch(error) {console.error("Error setUser: " + error.message)}
    }

    async setUserRequest (formData)
    {
        try {
            const response = await fetch('backend/game.php', {
                method: 'post',
                body: JSON.stringify(GameUi.formPostData(formData)),
                headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
            });
            if (!response.ok) {throw new Error(`HTTP ${response.status}`);}
            const data = await response.json();
            const expectedStatus = {success: 'success', invalid: 'error', saveFailed: 'error'};
            if (!data || !Object.prototype.hasOwnProperty.call(expectedStatus, data.code)
                || data.status !== expectedStatus[data.code]) {
                throw new Error('Invalid registration response');
            }
            this.setMsg(data.code);
        } catch (error) {
            console.error('Error GameRegistrationRequest:', error);
            this.setMsg('requestFailed');
        }
    }

    setMsg (code)
    {
        this.messageCode = code;
        this.updateTranslations();
    }

    updateTranslations ()
    {
        if (this.formMsg) {
            this.formMsg.textContent = this.messageCode
                ? this.translationHandler.getText(`registration.messages.${this.messageCode}`) : '';
        }
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
