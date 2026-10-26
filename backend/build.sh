#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate
python manage.py seed_services

# Ensure admin superuser exists
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
u, _ = User.objects.get_or_create(username='admin')
u.set_password('admin1234')
u.is_staff = True
u.is_superuser = True
u.email = 'bikkuyadav9190@gmail.com'
u.save()
print('Superuser admin ensured with password admin1234')
"
