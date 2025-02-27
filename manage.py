#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "HandyProject.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError:
        try:
            import django
            raise
        except ImportError:
            print("Couldn't import Django. Are you sure it's installed and "
                  "available on your PYTHONPATH environment variable?")
            sys.exit(1)
    execute_from_command_line(sys.argv)
