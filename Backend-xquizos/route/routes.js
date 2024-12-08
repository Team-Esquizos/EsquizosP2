    var express = require('express');
    const multer = require('multer');
const upload = multer();


    var userController = require('../src/user/userController');
    var studentController = require('../src/student/studentController');
    var teachingController = require('../src/teaching/teachingController');
    var courseController = require('../src/course/courseController');
    var courseInstanceController = require('../src/courseInstance/courseInstanceController');
    var commentController = require('../src/comment/commentController');

    const router = express.Router();

    router.route('/user/login').post(userController.loginUserControllerFn);
    router.route('/user/register').post(userController.registerUserControllerFn);
    router.route('/user/:username').get(userController.buscarUserControllerFn);
    router.post(
        '/usuarito/:username',
        upload.single('file'),
        userController.subirImagenControllerFn
      );

     router.get('/usuarito/:username/imagen', userController.obtenerImagenControllerFn);
      

    router.route('/student/register').post(studentController.registerStudentControllerFn);
    router.route('/student/get').get(studentController.getStudentsControllerFn);
    router.route('/student/:matricula').put(studentController.editStudentControllerFn);
    router.route('/student/remove/:matricula').delete(studentController.removeStudentControllerFn);
    router.route('/student/getcoursebynom/:nombre/:seccion').get(studentController.getCourseByNomControllerFn);
    //router.post('/estudiante/:matricula/acciones', addlista_de_accionesControllerFn);
    
    router.route('/teaching/register').post(teachingController.registerTeachingControllerFn);
    router.route('/teaching/get').get(teachingController.getTeachingsControllerFn);
    router.route('/teaching/:rut').put(teachingController.editTeachingControllerFn);
    router.route('/teaching/remove/:rut').delete(teachingController.removeTeachingControllerFn);

    router.route('/courses/register').post(courseController.registerCourseControllerFn);
    router.route('/courses/get').get(courseController.getCoursesControllerFn);
    router.route('/courses/:codigo').put(courseController.editCourseControllerFn);
    router.route('/courses/remove/:nombre/:seccion').delete(courseController.removeCourseControllerFn);
    router.route('/courses/getbyemail/:email').get(courseController.getCourseByEmailControllerFn);

    router.route('/courseInstance/register').post(courseInstanceController.registerCourseInstanceControllerFn);
    router.route('/courseInstance/get/:codCurso').get(courseInstanceController.getCourseInstanceControllerFn);
    router.route('/courseInstance/remove/:codCurso').delete(courseInstanceController.removeCourseInstanceControllerFn);
    router.route('/courseInstance/get').get(courseInstanceController.getAllCoursesInstanceControllerFn);
    router.route('/courseInstance/get/teacher/:codCurso/:periodo').get(courseInstanceController.getTeachingFromCourseInstanceControllerFn);
    router.route('/courseInstance/get/students/:codCurso/:periodo').get(courseInstanceController.getStudentsFromCourseInstanceControllerFn);
    router.route('/courseInstance/setTeaching/:codCurso/:periodo/:codDocente').put(courseInstanceController.updateCodDocenteInCourseInstanceControllerFn); 
    router.route('/courseInstance/addStudent/:codCurso/:periodo/:matricula').post(courseInstanceController.addStudentToCourseInstanceControllerFn);
    router.route('/courseInstance/getteacherinstance/:rut/:periodo').get(courseInstanceController.getTeacherCourseInstanceControllerFn);
    router.route('/courseInstance/removeStudent/:codCurso/:matricula').delete(courseInstanceController.removeStudentFromCourseInstanceControllerFn);
    
    
    
    router.route('/comments/add').post(commentController.addCommentControllerFn);
    router.route('/comments/remove/:_id').delete(commentController.removeCommentControllerFn);
    router.route('/comments/getFromMatricula/:matricula/:codCurso/:periodo').get(commentController.getCommentsControllerFn);
    router.route('/comments/getFromCourse/:codCurso/:periodo').get(commentController.getCommentsByCourseControllerFn);
    
    
    module.exports = router; 