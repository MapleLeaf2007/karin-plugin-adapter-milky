# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-08

### Added

- 🎉 Initial release of Karin Milky adapter
- ✅ HTTP client implementation for API calls
- ✅ WebSocket client implementation with event streaming
- ✅ Auto-reconnection support for WebSocket connections
- ✅ Complete TypeScript type definitions using official @saltify/milky-types
- ✅ Support for all Milky protocol message APIs:
  - send_private_message
  - send_group_message
  - recall_private_message
  - recall_group_message
  - get_message
  - get_history_messages
  - get_resource_temp_url
  - get_forwarded_messages
  - mark_message_as_read
- ✅ Support for all Milky protocol friend APIs:
  - send_friend_nudge
  - send_profile_like
  - get_friend_requests
  - accept_friend_request
  - reject_friend_request
- ✅ Support for all Milky protocol group APIs:
  - set_group_name
  - set_group_avatar
  - set_group_member_card
  - set_group_member_special_title
  - set_group_member_admin
  - set_group_member_mute
  - set_group_whole_mute
  - kick_group_member
  - get_group_announcements
  - send_group_announcement
  - delete_group_announcement
  - get_group_essence_messages
  - set_group_essence_message
  - quit_group
  - send_group_message_reaction
  - send_group_nudge
- ✅ Event system supporting all Milky protocol events
- ✅ Comprehensive documentation and examples
- ✅ Example code for HTTP mode, WebSocket mode, and Karin integration

### Dependencies

- @saltify/milky-types@1.0.0
- ws@8.18.3
- @types/ws@8.18.1

[1.0.0]: https://github.com/KarinJS/karin-plugin-adapter-milky/releases/tag/v1.0.0
