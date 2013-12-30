from cms.models.pluginmodel import CMSPlugin
from django.utils.translation import ugettext_lazy as _
from django.db import models

class SocialSchools(CMSPlugin):
    socialschools_url = models.CharField(max_length=125)
    community_id = models.IntegerField()
    only_descendants = models.BooleanField()
    only_headlines = models.BooleanField()
    number_of_items = models.IntegerField(_('Number of items to show'))
