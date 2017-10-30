angular.module('myApp', ['ngMaterial', 'ngMessages'
//, 'ui.tinymce'
//, 'ckeditor'
      // 'ngc-passo-a-passo',
]);
angular.module('myApp').controller('appCtrl', function ($scope, $http) {
      //$tical : false;

      $scope.options = {
            language: 'pt',
            allowedContent: true,
            entities: false
      };

      $scope.teste = function(){
            console.log( $scope.options.plugins)
      }
      function getBase64(file) {
            return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.readAsDataURL(file);
                  reader.onload = () => resolve(reader.result);
                  reader.onerror = error => reject(error);
            });
      }

      // this.$onInit = function () {
      //       $scope.tinymceModel = `<p style="text-align: center; font-size: 15px;"><img title="TinyMCE Logo" src="//www.tinymce.com/images/glyph-tinymce@2x.png" alt="TinyMCE Logo" width="110" height="97" /></p><h1 style="text-align: center;">Welcome to the TinyMCE editor demo!</h1><h1><img style="float: right; padding: 0 0 10px 10px;" title="Tiny Husky" src="//www.tinymce.com/docs/images/tiny-husky.jpg" alt="Tiny Husky" height="320" width="304" /></h1><h2>Image Tools Plugin feature<br>Click on the image to get started</h2><p>Please try out the features provided in this image tools example.</p><p>Note that any <b>MoxieManager</b> file and image management functionality in this example is part of our commercial offering – the demo is to show the integration.</h2><h2>Got questions or need help?</h2><ul><li>Our <a href="https://www.tinymce.com/docs/">documentation</a> is a great resource for learning how to configure TinyMCE.</li><li>Have a specific question? Visit the <a href="https://community.tinymce.com/forum/">Community Forum</a>.</li><li>We also offer enterprise grade support as part of <a href="www.tinymce.com/pricing">TinyMCE Enterprise</a>.</li></ul><h2>A simple table to play with</h2><table><thead><tr><th>Product</th><th>Cost</th><th>Really?</th></tr></thead><tbody><tr><td>TinyMCE</td><td>Free</td><td>YES!</td></tr><tr><td>Plupload</td><td>Free</td><td>YES!</td></tr></tbody></table><h2>Found a bug?</h2><p>If you think you have found a bug please create an issue on the <a href="https://github.com/tinymce/tinymce/issues">GitHub repo</a> to report it to the developers.</p><h2>Finally ...</h2><p>Don't forget to check out our other product <a href="http://www.plupload.com" target="_blank">Plupload</a>, your ultimate upload solution featuring HTML5 upload support.</p><p>Thanks for supporting TinyMCE! We hope it helps you and your users create great content.<br>All the best from the TinyMCE team.</p>`
      //       $scope.tinymceOptions = {
      //             //selector: 'textarea',
      //             height: 500,
      //             language: 'pt_BR',
      //             plugins: [
      //                   "advlist autolink lists link image charmap print preview anchor",
      //                   "searchreplace visualblocks code fullscreen",
      //                   "insertdatetime media table contextmenu paste imagetools"
      //             ],
      //             toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
      //             imagetools_cors_hosts: true,
      //             images_reuse_filename: true,
      //             images_upload_url: 'postAcceptor.php',
      //             imagetools_cors_hosts: ['www.w3schools.com'],
      //             images_upload_handler: function (blobInfo, success, failure) {
      //                   getBase64(blobInfo.blob()).then(function (base64) {
      //                         console.log(base64)
      //                         success(base64)
      //                   });
      //             },
      //             automatic_uploads: false,
      //             content_css: [
      //                   '//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
      //                   '//www.tinymce.com/css/codepen.min.css'
      //             ]
      //       };
      //       $scope.teste = function () {
      //             var ed = tinymce.get('content');
      //             console.log(ed)
      //       }


      //}

})