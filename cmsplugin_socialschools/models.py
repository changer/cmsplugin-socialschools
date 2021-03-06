from cms.models.pluginmodel import CMSPlugin
from django.utils.translation import ugettext_lazy as _
from django.db import models

class SocialSchools(CMSPlugin):

    CAROUSEL = 0
    GRID = 1

    PHOTO_CHOICES = (
        (CAROUSEL, 'Photos in Carousel'),
        (GRID, 'Photos in Grid'),
    )

    community_id = models.IntegerField(help_text=_(u"the ID (number) of the community you want to display public posts of. You can find this number in the addressbar when you navigate to the community page. E.g. the ID of https://desocialschool.socialschools.nl/communities/306 is 306"))
    only_descendants = models.BooleanField(help_text=_(u"This option will show public posts from any descendant community of the selected community."), default=False)
    community_and_descendants = models.BooleanField(help_text=_(u"This option will show public posts from Community and all it descendants."), default=False)
    only_photos = models.BooleanField(help_text=_(u"This option will show only the images from the most recent published posts in a carousel"), default=False)
    photo_choice = models.IntegerField(choices=PHOTO_CHOICES, default=CAROUSEL)
    headlines_with_thumbnails = models.BooleanField(_('Only headlines and thumbnails'), help_text=_(u"This option will only show the headlines and a thumbail if there is an image or event in the post."), default=False)
    number_of_items = models.IntegerField(_('Number of items per page'), help_text=_(u"The number of items per page with a maximum of 10."), blank=True, null=True)
    hide_events = models.BooleanField(help_text=_(u"This option will hide the events from being shown in the newsfeed"), default=False)

    def get_short_description(self):
        return u"%s" % self.community_id
