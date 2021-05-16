export const postGameData = (postData) => {

    fetch('/game/save-data', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(postData) // body data type must match "Content-Type" header
    });
}

