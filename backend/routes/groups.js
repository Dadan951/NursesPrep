const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const {
  getGroups, createGroup, getGroup,
  joinByCode, joinGroup, leaveGroup, deleteGroup,
  getPendingMembers, approveMember, rejectMember,
  getPosts, createPost, likePost, addComment,
} = require('../controllers/groupController');

router.use(protect);

// Groups list + create
router.route('/').get(getGroups).post(createGroup);

// Join any group by access code (no group ID needed)
router.post('/join-by-code', joinByCode);

// Single group
router.route('/:id').get(getGroup).delete(deleteGroup);

// Membership
router.post('/:id/join',  joinGroup);
router.post('/:id/leave', leaveGroup);

// Pending members (creator only)
router.get( '/:id/pending',              getPendingMembers);
router.post('/:id/approve/:userId',      approveMember);
router.delete('/:id/reject/:userId',     rejectMember);

// Posts
router.route('/:id/posts').get(getPosts).post(createPost);
router.post('/:id/posts/:postId/like',     likePost);
router.post('/:id/posts/:postId/comments', addComment);

module.exports = router;
