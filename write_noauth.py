import re

f = open(r'C:\Users\Admin\perm-crm\backend\main.py', 'r')
content = f.read()
f.close()

# Remove auth requirement from all routes
content = content.replace(', user=Depends(get_current_user)', '')

f = open(r'C:\Users\Admin\perm-crm\backend\main.py', 'w')
f.write(content)
f.close()
print("Auth removed - backend is now open access!")