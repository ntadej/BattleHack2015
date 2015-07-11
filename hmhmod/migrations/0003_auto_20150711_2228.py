# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hmhmod', '0002_opinion_value'),
    ]

    operations = [
        migrations.AddField(
            model_name='candidate',
            name='img_url',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='max_label',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='issue',
            name='min_label',
            field=models.TextField(blank=True, null=True),
        ),
    ]
