var model;

async function loadModel() {
    model = await tf.loadGraphModel('TFJS/model.json');
    return model;
}

function predictImage() {

    let image = cv.imread(canvas);
    image = change2Gray(image);
    image = findCountoursAndBoundRect(image);
    image = resizeImg(image);
    image = centreOfMass(image);

    let tensorValues = (Float32Array.from(image.data)).map(function(item){
        return item / 255.0;
    });
    const X = tf.tensor([tensorValues]);
    
    var result = model.predict(X);
    result.print();
    return result.dataSync()[0];

    // result.dispose();
    // X.dispose();
    // TEst
    var x = document.createElement('CANVAS');
    cv.imshow(x, image);
    document.body.appendChild(x);

}

function change2Gray(src) {
    let dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY, 0);
    cv.threshold(dst, dst, 175, 255, cv.THRESH_OTSU);
    return dst;
    dst.delete();
}

function findCountoursAndBoundRect(src) {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE);

    let cnt = contours.get(0);
    let rect = cv.boundingRect(cnt);
    contours.delete(); hierarchy.delete();
    return src.roi(rect);
}

function resizeImg(img) {
    let dst = new cv.Mat();
    var height = img.rows;
    var width = img.cols;
    if (height > width) {
        var scale = (height / width);
        var dsize = new cv.Size(Math.round(20 / scale), 20);
    }
    else {
        var scale = width / height;
        var dsize = new cv.Size(20, Math.round(20 / scale));
    }
    cv.resize(img, dst, dsize, 0, 0, cv.INTER_AREA);

    const LEFT = Math.ceil(4 + (20 - dst.cols)/2);
    const RIGHT = Math.floor(4 + (20 - dst.cols)/2);
    const TOP = Math.ceil(4 + (20 - dst.rows)/2);
    const BOTTOM = Math.floor(4 + (20 - dst.rows)/2);

    let s = new cv.Scalar(0);
    cv.copyMakeBorder(dst, dst, TOP, BOTTOM, LEFT, RIGHT,
         cv.BORDER_CONSTANT, s)
    return dst;
}

function centreOfMass(src) {
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(src, contours, hierarchy, cv.RETR_CCOMP,
        cv.CHAIN_APPROX_SIMPLE);
    cnt = contours.get(0);
    const Moments = cv.moments(cnt, false);
    const cx = Moments.m10 / Moments.m00;
    const cy = Moments.m10 / Moments.m00;
    //
    const X_SHIFT = Math.round(src.cols/2.0 - cx);
    const Y_SHIFT = Math.round(src.rows/2.0 - cy);

    let M = cv.matFromArray(2, 3, cv.CV_64FC1, 
        [1, 0, X_SHIFT, 0, 1, Y_SHIFT]);
    let dsize = new cv.Size(src.rows, src.cols);
    let dst = new cv.Mat();
    cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR,
         cv.BORDER_CONSTANT, new cv.Scalar(0));
    contours.delete(); hierarchy.delete(); //dsize.delete();
    return dst;
}