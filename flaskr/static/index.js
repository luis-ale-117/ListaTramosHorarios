const table = document.getElementById('schedule')
const tableRows = Array.from(document.getElementById('schedule_body').children)
const updateButton = document.getElementById('update-button')

//Returns if user has already the selected resource
const userHasResource = (tabRow)=>tabRow.classList.contains('table-success')
//Returns if resource is unavailable because of other users usage
const resourceUnavailable = (tabRow)=>tabRow.classList.contains('table-danger')
//Gives the resource to this user by coloring selected row as green
const giveResourceToUser = (tabRow)=>tabRow.classList.add('table-success')
//Returns the resource from this user by decoloring selected green row
const returnResourceFromUser = (tabRow)=>tabRow.classList.remove('table-success')
//Set the resource as unavailable because of other users usage by coloring selected row as red
const setResourceAsUnavailable = (tabRow)=>tabRow.classList.add('table-danger')
//Set the resource as available by decoloring selected red row
const setResourceAsAvailable = (tabRow)=>tabRow.classList.remove('table-danger')
//Updates each row in the table
const updateScheduleTable = ()=>{
    fetch('/update-motorcycle')
        .then(res => res.json())
        .then(data => {
            if (data['status'] == 'ok') {
                let num_motorcycles = 0
                for (const i in tableRows) {
                    num_motorcycles = parseInt(data['motorcycles_update'][i])
                    tableRows[i].lastElementChild.textContent = data['motorcycles_update'][i]
                    if (!userHasResource(tableRows[i])) {
                        if (num_motorcycles == 0) {
                            setResourceAsUnavailable(tableRows[i])
                        } else if (num_motorcycles > 0) {
                            setResourceAsAvailable(tableRows[i])
                        }
                    }
                }
            }
            else{
                console.log(data['status'])
            }
        })
        .catch(error => console.log(error))
}

/**
 * If row has no success and no danger: Give resource and update
 * elif row has success: Return resource and update
 * elif row has danger: Just update
 * After any action update
 */
table.addEventListener('click', (e) => {
    const tableRow = e.target.parentElement
    const hour = tableRow.firstElementChild.textContent
    if(!userHasResource(tableRow) && !resourceUnavailable(tableRow)){
        let action = 'get_motorcycle'
        fetch('/request-motorcycle', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                action,
                hour
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data['status'] == 'ok') {
                    giveResourceToUser(tableRow)
                } else {
                    console.log(data['status'])
                }
            })
            .catch(error => console.log(error))
    }
    else if(userHasResource(tableRow)){
        let action = 'return_motorcycle'
        fetch('/request-motorcycle', {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({
                action,
                hour
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data['status'] == 'ok'){
                    returnResourceFromUser(tableRow)
                } else {
                    console.log(data['status'])
                }
            })
            .catch(error => console.log(error))
    }
    updateScheduleTable()
})

updateButton.addEventListener('click', () => {
    updateScheduleTable()
})

updateScheduleTable()
/**
 * Siempre pon el numero nuevo
 * Si no lo tiene:
 *  Si motos = 0 :
 *    Ponlo unavailable
 *  Si motos > 0:
 *    ponlo available
 */