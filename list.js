let draggedItem;

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addItem();
    }
}

function clearList() {
    const items = document.getElementById('items');
    while (items.firstChild) {
        items.removeChild(items.firstChild);
    }
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    draggedItem = event.target;
}

function drop(event) {
    event.preventDefault();
    if (event.target.className === 'item') {
        event.target.parentNode.insertBefore(draggedItem, event.target);
    } else {
        event.target.appendChild(draggedItem);
    }
}

function addItem() {
    const newItemInput = document.getElementById('newItemInput').value.trim();
    if (newItemInput === '') return;
    
    const newItem = document.createElement('div');
    newItem.className = 'item';
    newItem.draggable = true;
    newItem.addEventListener('dragstart', drag);
    
    const itemText = document.createElement('span');
    itemText.textContent = newItemInput;
    newItem.appendChild(itemText);
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.innerText = 'Delete';
    deleteButton.onclick = function() {
        newItem.remove();
    };
    newItem.appendChild(deleteButton);
    
    document.getElementById('items').appendChild(newItem);
    document.getElementById('newItemInput').value = '';
}

function exportList() {
    const items = [];
    const itemElements = document.querySelectorAll('.item');
    itemElements.forEach(item => {
        const text = item.querySelector('span').textContent;
        items.push({
            text: text,
            priority: Array.from(item.parentNode.children).indexOf(item)
        });
    });
    const json = JSON.stringify(items, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'list.json';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

function importList(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const json = event.target.result;
            const items = JSON.parse(json);
            items.forEach(item => {
                const newItem = document.createElement('div');
                newItem.className = 'item';
                newItem.draggable = true;
                newItem.addEventListener('dragstart', drag);
                
                const itemText = document.createElement('span');
                itemText.textContent = item.text;
                newItem.appendChild(itemText);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'delete-button';
                deleteButton.innerText = 'Delete';
                deleteButton.onclick = function() {
                    newItem.remove();
                };
                newItem.appendChild(deleteButton);

                document.getElementById('items').appendChild(newItem);
            });
        } catch (error) {
            alert('Invalid JSON file!');
        }
    };
    reader.readAsText(file);
}