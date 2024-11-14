    var express = require('express');

    var userController = require('../src/user/userController');
    var studentController = require('../src/student/studentController');
    var teachingController = require('../src/teaching/teachingController');
    var courseController = require('../src/course/courseController');
    const router = express.Router();

    router.route('/user/login').post(userController.loginUserControllerFn);
    router.route('/user/register').post(userController.registerUserControllerFn);
    router.route('/user/:username').get(userController.buscarUserControllerFn);

    router.route('/student/register').post(studentController.registerStudentControllerFn);
    router.route('/student/get').get(studentController.getStudentsControllerFn);
    router.route('/student/:matricula').put(studentController.editStudentControllerFn);
    router.route('/student/remove/:matricula').delete(studentController.removeStudentControllerFn);

    router.route('/teaching/register').post(teachingController.registerTeachingControllerFn);
    router.route('/teaching/get').get(teachingController.getTeachingsControllerFn);
    router.route('/teaching/:rut').put(teachingController.editTeachingControllerFn);
    router.route('/teaching/remove/:rut').delete(teachingController.removeTeachingControllerFn);

    router.route('/courses/register').post(courseController.registerCourseControllerFn);
    router.route('/courses/get').get(courseController.getCoursesControllerFn);
    router.route('/courses/:nombre/:seccion').put(courseController.editCourseControllerFn);
    router.route('/courses/remove/:nombre/:seccion').delete(courseController.removeCourseControllerFn);

    module.exports = router; 