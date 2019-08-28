const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;  // gets product ID from parent node
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const productElement = btn.closest('article'); // assigned article tag that is closest btn

    fetch('/admin/product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    })
        .then(result => {
            return result.json();
        })
        .then(data => {
            console.log(data);
            productElement.remove();    // for IE use productElement.parentNode.removeChild(product);
        })
        .catch(err => {
            console.log(err);
        });
};