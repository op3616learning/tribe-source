import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import AtLineIcon from 'remixicon-react/AtLineIcon';
import ReplyFillIcon from 'remixicon-react/ReplyFillIcon';
import { NotificationVerb, PayloadType, NotificationReason, } from 'tribe-api';
import { Trans } from 'tribe-translation';
import { Avatar } from '../../Avatar';
import { Emoji } from '../../Emoji';
import { Icon } from '../../Icon';
import { Text } from '../../Text';
dayjs.extend(relativeTime);
const HighlightedTitle = ({ children }) => (React.createElement(Text, { d: "inline", fontWeight: "bold", fontSize: "inherit", color: "label.primary" }, children));
export const getTitle = (actor, meta, object, target, verb) => {
    if (!actor || !(target && target.type)) {
        // eslint-disable-next-line no-console
        console.error('error - Invalid Notification Structure', actor, target);
        return null;
    }
    const actorName = actor.summary;
    switch (verb) {
        case NotificationVerb.COMMENT_DELETED: {
            switch (meta === null || meta === void 0 ? void 0 : meta.reason) {
                case NotificationReason.POST_SUBSCRIPTION:
                    return (React.createElement(Trans, { i18nKey: "notification:commentDeletedPostSubscription", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> removed a comment in a post you are following <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
                default:
                    return (React.createElement(Trans, { i18nKey: "notification:commentDeleted", values: {
                            actorName,
                            postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle,
                        }, defaults: "<highlight>{{ actorName }}</highlight> removed a comment in <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
            }
        }
        case NotificationVerb.POST_DELETED: {
            switch (meta === null || meta === void 0 ? void 0 : meta.reason) {
                case NotificationReason.POST_SUBSCRIPTION:
                    return (React.createElement(Trans, { i18nKey: "notification:postDeletedPostSubscription", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> removed a post you were following <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
                default:
                    return (React.createElement(Trans, { i18nKey: "notification:postDeleted", values: {
                            actorName,
                            postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle,
                        }, defaults: "<highlight>{{ actorName }}</highlight> removed <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
            }
        }
        case NotificationVerb.POST_UPDATED:
        case NotificationVerb.COMMENT_UPDATED: {
            switch (meta === null || meta === void 0 ? void 0 : meta.reason) {
                case NotificationReason.POST_SUBSCRIPTION:
                    return (React.createElement(Trans, { i18nKey: "notification:postUpdatedPostSubscription", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> updated a post you are following <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
                default:
                    return (React.createElement(Trans, { i18nKey: "notification:postUpdated", values: {
                            actorName,
                            postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle,
                        }, defaults: "<highlight>{{ actorName }}</highlight> updated <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
            }
        }
        case NotificationVerb.COMMENT_CREATED:
        case NotificationVerb.REPLY_CREATED: {
            switch (meta === null || meta === void 0 ? void 0 : meta.reason) {
                case NotificationReason.POST_SUBSCRIPTION:
                    return (React.createElement(Trans, { i18nKey: "notification:replyCreatedPostSubscription", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> replied to a post you are following <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
                default:
                    return (React.createElement(Trans, { i18nKey: "notification:replyCreated", values: {
                            actorName,
                            postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle,
                        }, defaults: "<highlight>{{ actorName }}</highlight> replied to <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
            }
        }
        case NotificationVerb.REACTION_CREATED: {
            switch (meta === null || meta === void 0 ? void 0 : meta.reason) {
                case NotificationReason.POST_SUBSCRIPTION:
                    return (React.createElement(Trans, { i18nKey: "notification:reactionCreatedPostSubscription", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> reacted to a post you are following <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
                default:
                    return (React.createElement(Trans, { i18nKey: "notification:reactionCreated", values: { actorName, postTitle: (meta === null || meta === void 0 ? void 0 : meta.textTitle) || (target === null || target === void 0 ? void 0 : target.name) }, defaults: "<highlight>{{ actorName }}</highlight> reacted to <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
            }
        }
        case NotificationVerb.POST_CREATED:
            return (React.createElement(Trans, { i18nKey: "notification:post.created", values: { actorName, space: target.summary }, defaults: "<highlight>{{ actorName }}</highlight> posted in <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.MEMBER_MENTIONED:
            return (React.createElement(Trans, { i18nKey: "notification:post.memberMentioned", values: { actorName, postTitle: meta === null || meta === void 0 ? void 0 : meta.textTitle }, defaults: "<highlight>{{ actorName }}</highlight> mentioned you in <highlight>{{ postTitle }}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return (React.createElement(Trans, { i18nKey: "notification:space.added", values: { actorName, space: target.summary, name: object.summary }, defaults: "<highlight>{{ actorName }}</highlight> added {{name}} to <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        case NotificationVerb.JOIN_REQUEST_STATUS_UPDATED:
            return (React.createElement(Trans, { i18nKey: "notification:space.joinRequestStatusUpdated", values: { actorName, space: target.summary, name: object.summary }, defaults: "<highlight>{{ actorName }}</highlight> added {{name}} to <highlight>{{space}}</highlight>", components: { highlight: React.createElement(HighlightedTitle, null) } }));
        default:
            // logger.warn('missing handler for notification verb', verb)
            return (React.createElement(Trans, { i18nKey: "notification:other", values: {
                    actorName,
                    target: target.type.toLowerCase(),
                    verb,
                }, defaults: "<highlight>{{ actorName }}</highlight> {{verb}} on your {{target}}", components: { highlight: React.createElement(HighlightedTitle, null) } }));
    }
};
export const getIcon = (actor, target, object, verb) => {
    if (!actor || !(target && target.type)) {
        // logger.error('error - Invalid Notification Structure', actor, target)
        return null;
    }
    switch (verb) {
        case NotificationVerb.COMMENT_CREATED:
        case NotificationVerb.REPLY_CREATED:
            return React.createElement(Icon, { as: ReplyFillIcon });
        case NotificationVerb.MEMBER_MENTIONED:
            return React.createElement(Icon, { as: AtLineIcon });
        case NotificationVerb.POST_CREATED:
        case NotificationVerb.JOIN_REQUEST_STATUS_UPDATED:
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return (React.createElement(Avatar, { src: target.media, name: target.name, size: "xs", border: "2px" }));
        case NotificationVerb.REACTION_CREATED:
            return React.createElement(Emoji, { src: object.name, size: "xs" });
        default:
            return null;
    }
};
export const getTime = (date) => {
    return dayjs(date).fromNow();
};
export const getNotificationLink = (notification) => {
    if (!notification) {
        return;
    }
    const { target, space, verb, object } = notification;
    switch (verb) {
        case NotificationVerb.SPACE_MEMBER_ADDED:
            return space ? `/${space === null || space === void 0 ? void 0 : space.slug}/post?from=/notifications` : null;
        case NotificationVerb.POST_CREATED:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${object === null || object === void 0 ? void 0 : object.id}?from=/notifications`
                : null;
        case NotificationVerb.REPLY_CREATED:
        case NotificationVerb.COMMENT_CREATED:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications#comment/${object === null || object === void 0 ? void 0 : object.id}`
                : null;
        default:
        // decide based on target type
    }
    switch (target === null || target === void 0 ? void 0 : target.type) {
        case PayloadType.SPACE:
            return space ? `/${space === null || space === void 0 ? void 0 : space.slug}/post?from=/notifications` : null;
        case PayloadType.POST:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications`
                : null;
        case PayloadType.REACTION:
            return space
                ? `/${space === null || space === void 0 ? void 0 : space.slug}/post/${target === null || target === void 0 ? void 0 : target.id}?from=/notifications`
                : null;
        case PayloadType.MEMBER:
            return `/member/${object === null || object === void 0 ? void 0 : object.id}`;
        default:
    }
};
//# sourceMappingURL=index.js.map