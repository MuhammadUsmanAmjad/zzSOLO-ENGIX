import { Router } from 'express';
import { create, find, update, deleteRecord } from '../controller/controller.js';

const route = Router();

// route.get('/', homeRoutes);
// route.get('/add-user', add_user);
// route.get('/update-user', update_user);

route.post('/api/users', create);
route.get('/api/users', find);
route.put('/api/users/:id', update);
route.delete('/api/users/:id', deleteRecord);

route.use(($) => {
    $(document).on('submit', '#add_user', (event) => {
        event.preventDefault();
        const unindexed_array = $(event.target).serializeArray();
        const data = {};

        $.map(unindexed_array, (n, i) => {
            data[n.name] = n.value;
        });

        const request = {
            url: 'http://localhost:3000/api/users',
            method: 'POST',
            data: data,
        };

        $.ajax(request).done(() => {
            alert('Data Inserted Successfully!');
            location.reload();
        });
    });

    $(document).on('submit', '#update_user', (event) => {
        event.preventDefault();
        const unindexed_array = $(event.target).serializeArray();
        const data = {};

        $.map(unindexed_array, (n, i) => {
            data[n.name] = n.value;
        });

        const id = data.id;
        delete data.id;

        const request = {
            url: `http://localhost:3000/api/users/${id}`,
            method: 'PUT',
            data: data,
        };

        $.ajax(request).done(() => {
            alert('Data Updated Successfully!');
            location.reload();
        });
    });

    if (window.location.pathname === '/') {
        const $ondelete = $('.table tbody td a.delete');
        $ondelete.click(function () {
            const id = $(this).attr('data-id');

            const request = {
                url: `http://localhost:3000/api/users/${id}`,
                method: 'DELETE',
            };

            if (confirm('Do you really want to delete this record?')) {
                $.ajax(request).done(() => {
                    alert('Data Deleted Successfully!');
                    location.reload();
                });
            }
        });
    }
});

export default route;
