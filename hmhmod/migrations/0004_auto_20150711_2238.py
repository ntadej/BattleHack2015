# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('hmhmod', '0003_auto_20150711_2228'),
    ]

    operations = [
        migrations.CreateModel(
            name='Charity',
            fields=[
                ('id', models.AutoField(auto_created=True, verbose_name='ID', primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('description', models.TextField()),
                ('value', models.IntegerField()),
                ('issue', models.ForeignKey(to='hmhmod.Issue')),
            ],
        ),
        migrations.AddField(
            model_name='candidate',
            name='description',
            field=models.TextField(blank=True, null=True),
        ),
    ]
