//==================================================================================
//	WalkerOne	--- Realtime 4D CG
//	2017/05/24	by pionier
//	http://www7b.biglobe.ne.jp/~fdw
//==================================================================================

// glMatrix v0.9.5
glMatrixArrayType=typeof Float32Array!="undefined"?Float32Array:typeof WebGLFloatArray!="undefined"?WebGLFloatArray:Array;var vec3={};vec3.create=function(a){var b=new glMatrixArrayType(3);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2]}return b};vec3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];return b};vec3.add=function(a,b,c){if(!c||a==c){a[0]+=b[0];a[1]+=b[1];a[2]+=b[2];return a}c[0]=a[0]+b[0];c[1]=a[1]+b[1];c[2]=a[2]+b[2];return c};
vec3.subtract=function(a,b,c){if(!c||a==c){a[0]-=b[0];a[1]-=b[1];a[2]-=b[2];return a}c[0]=a[0]-b[0];c[1]=a[1]-b[1];c[2]=a[2]-b[2];return c};vec3.negate=function(a,b){b||(b=a);b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];return b};vec3.scale=function(a,b,c){if(!c||a==c){a[0]*=b;a[1]*=b;a[2]*=b;return a}c[0]=a[0]*b;c[1]=a[1]*b;c[2]=a[2]*b;return c};
vec3.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=Math.sqrt(c*c+d*d+e*e);if(g){if(g==1){b[0]=c;b[1]=d;b[2]=e;return b}}else{b[0]=0;b[1]=0;b[2]=0;return b}g=1/g;b[0]=c*g;b[1]=d*g;b[2]=e*g;return b};vec3.cross=function(a,b,c){c||(c=a);var d=a[0],e=a[1];a=a[2];var g=b[0],f=b[1];b=b[2];c[0]=e*b-a*f;c[1]=a*g-d*b;c[2]=d*f-e*g;return c};vec3.length=function(a){var b=a[0],c=a[1];a=a[2];return Math.sqrt(b*b+c*c+a*a)};vec3.dot=function(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]};
vec3.direction=function(a,b,c){c||(c=a);var d=a[0]-b[0],e=a[1]-b[1];a=a[2]-b[2];b=Math.sqrt(d*d+e*e+a*a);if(!b){c[0]=0;c[1]=0;c[2]=0;return c}b=1/b;c[0]=d*b;c[1]=e*b;c[2]=a*b;return c};vec3.lerp=function(a,b,c,d){d||(d=a);d[0]=a[0]+c*(b[0]-a[0]);d[1]=a[1]+c*(b[1]-a[1]);d[2]=a[2]+c*(b[2]-a[2]);return d};vec3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+"]"};var mat3={};
mat3.create=function(a){var b=new glMatrixArrayType(9);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9]}return b};mat3.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];return b};mat3.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=1;a[5]=0;a[6]=0;a[7]=0;a[8]=1;return a};
mat3.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[5];a[1]=a[3];a[2]=a[6];a[3]=c;a[5]=a[7];a[6]=d;a[7]=e;return a}b[0]=a[0];b[1]=a[3];b[2]=a[6];b[3]=a[1];b[4]=a[4];b[5]=a[7];b[6]=a[2];b[7]=a[5];b[8]=a[8];return b};mat3.toMat4=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=0;b[4]=a[3];b[5]=a[4];b[6]=a[5];b[7]=0;b[8]=a[6];b[9]=a[7];b[10]=a[8];b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat3.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+"]"};var mat4={};mat4.create=function(a){var b=new glMatrixArrayType(16);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15]}return b};
mat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=a[12];b[13]=a[13];b[14]=a[14];b[15]=a[15];return b};mat4.identity=function(a){a[0]=1;a[1]=0;a[2]=0;a[3]=0;a[4]=0;a[5]=1;a[6]=0;a[7]=0;a[8]=0;a[9]=0;a[10]=1;a[11]=0;a[12]=0;a[13]=0;a[14]=0;a[15]=1;return a};
mat4.transpose=function(a,b){if(!b||a==b){var c=a[1],d=a[2],e=a[3],g=a[6],f=a[7],h=a[11];a[1]=a[4];a[2]=a[8];a[3]=a[12];a[4]=c;a[6]=a[9];a[7]=a[13];a[8]=d;a[9]=g;a[11]=a[14];a[12]=e;a[13]=f;a[14]=h;return a}b[0]=a[0];b[1]=a[4];b[2]=a[8];b[3]=a[12];b[4]=a[1];b[5]=a[5];b[6]=a[9];b[7]=a[13];b[8]=a[2];b[9]=a[6];b[10]=a[10];b[11]=a[14];b[12]=a[3];b[13]=a[7];b[14]=a[11];b[15]=a[15];return b};
mat4.determinant=function(a){var b=a[0],c=a[1],d=a[2],e=a[3],g=a[4],f=a[5],h=a[6],i=a[7],j=a[8],k=a[9],l=a[10],o=a[11],m=a[12],n=a[13],p=a[14];a=a[15];return m*k*h*e-j*n*h*e-m*f*l*e+g*n*l*e+j*f*p*e-g*k*p*e-m*k*d*i+j*n*d*i+m*c*l*i-b*n*l*i-j*c*p*i+b*k*p*i+m*f*d*o-g*n*d*o-m*c*h*o+b*n*h*o+g*c*p*o-b*f*p*o-j*f*d*a+g*k*d*a+j*c*h*a-b*k*h*a-g*c*l*a+b*f*l*a};
mat4.inverse=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=a[4],h=a[5],i=a[6],j=a[7],k=a[8],l=a[9],o=a[10],m=a[11],n=a[12],p=a[13],r=a[14],s=a[15],A=c*h-d*f,B=c*i-e*f,t=c*j-g*f,u=d*i-e*h,v=d*j-g*h,w=e*j-g*i,x=k*p-l*n,y=k*r-o*n,z=k*s-m*n,C=l*r-o*p,D=l*s-m*p,E=o*s-m*r,q=1/(A*E-B*D+t*C+u*z-v*y+w*x);b[0]=(h*E-i*D+j*C)*q;b[1]=(-d*E+e*D-g*C)*q;b[2]=(p*w-r*v+s*u)*q;b[3]=(-l*w+o*v-m*u)*q;b[4]=(-f*E+i*z-j*y)*q;b[5]=(c*E-e*z+g*y)*q;b[6]=(-n*w+r*t-s*B)*q;b[7]=(k*w-o*t+m*B)*q;b[8]=(f*D-h*z+j*x)*q;
b[9]=(-c*D+d*z-g*x)*q;b[10]=(n*v-p*t+s*A)*q;b[11]=(-k*v+l*t-m*A)*q;b[12]=(-f*C+h*y-i*x)*q;b[13]=(c*C-d*y+e*x)*q;b[14]=(-n*u+p*B-r*A)*q;b[15]=(k*u-l*B+o*A)*q;return b};mat4.toRotationMat=function(a,b){b||(b=mat4.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];b[4]=a[4];b[5]=a[5];b[6]=a[6];b[7]=a[7];b[8]=a[8];b[9]=a[9];b[10]=a[10];b[11]=a[11];b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};
mat4.toMat3=function(a,b){b||(b=mat3.create());b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[4];b[4]=a[5];b[5]=a[6];b[6]=a[8];b[7]=a[9];b[8]=a[10];return b};mat4.toInverseMat3=function(a,b){var c=a[0],d=a[1],e=a[2],g=a[4],f=a[5],h=a[6],i=a[8],j=a[9],k=a[10],l=k*f-h*j,o=-k*g+h*i,m=j*g-f*i,n=c*l+d*o+e*m;if(!n)return null;n=1/n;b||(b=mat3.create());b[0]=l*n;b[1]=(-k*d+e*j)*n;b[2]=(h*d-e*f)*n;b[3]=o*n;b[4]=(k*c-e*i)*n;b[5]=(-h*c+e*g)*n;b[6]=m*n;b[7]=(-j*c+d*i)*n;b[8]=(f*c-d*g)*n;return b};
mat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2],f=a[3],h=a[4],i=a[5],j=a[6],k=a[7],l=a[8],o=a[9],m=a[10],n=a[11],p=a[12],r=a[13],s=a[14];a=a[15];var A=b[0],B=b[1],t=b[2],u=b[3],v=b[4],w=b[5],x=b[6],y=b[7],z=b[8],C=b[9],D=b[10],E=b[11],q=b[12],F=b[13],G=b[14];b=b[15];c[0]=A*d+B*h+t*l+u*p;c[1]=A*e+B*i+t*o+u*r;c[2]=A*g+B*j+t*m+u*s;c[3]=A*f+B*k+t*n+u*a;c[4]=v*d+w*h+x*l+y*p;c[5]=v*e+w*i+x*o+y*r;c[6]=v*g+w*j+x*m+y*s;c[7]=v*f+w*k+x*n+y*a;c[8]=z*d+C*h+D*l+E*p;c[9]=z*e+C*i+D*o+E*r;c[10]=z*
g+C*j+D*m+E*s;c[11]=z*f+C*k+D*n+E*a;c[12]=q*d+F*h+G*l+b*p;c[13]=q*e+F*i+G*o+b*r;c[14]=q*g+F*j+G*m+b*s;c[15]=q*f+F*k+G*n+b*a;return c};mat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1];b=b[2];c[0]=a[0]*d+a[4]*e+a[8]*b+a[12];c[1]=a[1]*d+a[5]*e+a[9]*b+a[13];c[2]=a[2]*d+a[6]*e+a[10]*b+a[14];return c};
mat4.multiplyVec4=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=b[3];c[0]=a[0]*d+a[4]*e+a[8]*g+a[12]*b;c[1]=a[1]*d+a[5]*e+a[9]*g+a[13]*b;c[2]=a[2]*d+a[6]*e+a[10]*g+a[14]*b;c[3]=a[3]*d+a[7]*e+a[11]*g+a[15]*b;return c};
mat4.translate=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[12]=a[0]*d+a[4]*e+a[8]*b+a[12];a[13]=a[1]*d+a[5]*e+a[9]*b+a[13];a[14]=a[2]*d+a[6]*e+a[10]*b+a[14];a[15]=a[3]*d+a[7]*e+a[11]*b+a[15];return a}var g=a[0],f=a[1],h=a[2],i=a[3],j=a[4],k=a[5],l=a[6],o=a[7],m=a[8],n=a[9],p=a[10],r=a[11];c[0]=g;c[1]=f;c[2]=h;c[3]=i;c[4]=j;c[5]=k;c[6]=l;c[7]=o;c[8]=m;c[9]=n;c[10]=p;c[11]=r;c[12]=g*d+j*e+m*b+a[12];c[13]=f*d+k*e+n*b+a[13];c[14]=h*d+l*e+p*b+a[14];c[15]=i*d+o*e+r*b+a[15];return c};
mat4.scale=function(a,b,c){var d=b[0],e=b[1];b=b[2];if(!c||a==c){a[0]*=d;a[1]*=d;a[2]*=d;a[3]*=d;a[4]*=e;a[5]*=e;a[6]*=e;a[7]*=e;a[8]*=b;a[9]*=b;a[10]*=b;a[11]*=b;return a}c[0]=a[0]*d;c[1]=a[1]*d;c[2]=a[2]*d;c[3]=a[3]*d;c[4]=a[4]*e;c[5]=a[5]*e;c[6]=a[6]*e;c[7]=a[7]*e;c[8]=a[8]*b;c[9]=a[9]*b;c[10]=a[10]*b;c[11]=a[11]*b;c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15];return c};
mat4.rotate=function(a,b,c,d){var e=c[0],g=c[1];c=c[2];var f=Math.sqrt(e*e+g*g+c*c);if(!f)return null;if(f!=1){f=1/f;e*=f;g*=f;c*=f}var h=Math.sin(b),i=Math.cos(b),j=1-i;b=a[0];f=a[1];var k=a[2],l=a[3],o=a[4],m=a[5],n=a[6],p=a[7],r=a[8],s=a[9],A=a[10],B=a[11],t=e*e*j+i,u=g*e*j+c*h,v=c*e*j-g*h,w=e*g*j-c*h,x=g*g*j+i,y=c*g*j+e*h,z=e*c*j+g*h;e=g*c*j-e*h;g=c*c*j+i;if(d){if(a!=d){d[12]=a[12];d[13]=a[13];d[14]=a[14];d[15]=a[15]}}else d=a;d[0]=b*t+o*u+r*v;d[1]=f*t+m*u+s*v;d[2]=k*t+n*u+A*v;d[3]=l*t+p*u+B*
v;d[4]=b*w+o*x+r*y;d[5]=f*w+m*x+s*y;d[6]=k*w+n*x+A*y;d[7]=l*w+p*x+B*y;d[8]=b*z+o*e+r*g;d[9]=f*z+m*e+s*g;d[10]=k*z+n*e+A*g;d[11]=l*z+p*e+B*g;return d};mat4.rotateX=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[4],g=a[5],f=a[6],h=a[7],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[0]=a[0];c[1]=a[1];c[2]=a[2];c[3]=a[3];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[4]=e*b+i*d;c[5]=g*b+j*d;c[6]=f*b+k*d;c[7]=h*b+l*d;c[8]=e*-d+i*b;c[9]=g*-d+j*b;c[10]=f*-d+k*b;c[11]=h*-d+l*b;return c};
mat4.rotateY=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[8],j=a[9],k=a[10],l=a[11];if(c){if(a!=c){c[4]=a[4];c[5]=a[5];c[6]=a[6];c[7]=a[7];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*-d;c[1]=g*b+j*-d;c[2]=f*b+k*-d;c[3]=h*b+l*-d;c[8]=e*d+i*b;c[9]=g*d+j*b;c[10]=f*d+k*b;c[11]=h*d+l*b;return c};
mat4.rotateZ=function(a,b,c){var d=Math.sin(b);b=Math.cos(b);var e=a[0],g=a[1],f=a[2],h=a[3],i=a[4],j=a[5],k=a[6],l=a[7];if(c){if(a!=c){c[8]=a[8];c[9]=a[9];c[10]=a[10];c[11]=a[11];c[12]=a[12];c[13]=a[13];c[14]=a[14];c[15]=a[15]}}else c=a;c[0]=e*b+i*d;c[1]=g*b+j*d;c[2]=f*b+k*d;c[3]=h*b+l*d;c[4]=e*-d+i*b;c[5]=g*-d+j*b;c[6]=f*-d+k*b;c[7]=h*-d+l*b;return c};
mat4.frustum=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=e*2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=e*2/i;f[6]=0;f[7]=0;f[8]=(b+a)/h;f[9]=(d+c)/i;f[10]=-(g+e)/j;f[11]=-1;f[12]=0;f[13]=0;f[14]=-(g*e*2)/j;f[15]=0;return f};mat4.perspective=function(a,b,c,d,e){a=c*Math.tan(a*Math.PI/360);b=a*b;return mat4.frustum(-b,b,-a,a,c,d,e)};
mat4.ortho=function(a,b,c,d,e,g,f){f||(f=mat4.create());var h=b-a,i=d-c,j=g-e;f[0]=2/h;f[1]=0;f[2]=0;f[3]=0;f[4]=0;f[5]=2/i;f[6]=0;f[7]=0;f[8]=0;f[9]=0;f[10]=-2/j;f[11]=0;f[12]=-(a+b)/h;f[13]=-(d+c)/i;f[14]=-(g+e)/j;f[15]=1;return f};
mat4.lookAt=function(a,b,c,d){d||(d=mat4.create());var e=a[0],g=a[1];a=a[2];var f=c[0],h=c[1],i=c[2];c=b[1];var j=b[2];if(e==b[0]&&g==c&&a==j)return mat4.identity(d);var k,l,o,m;c=e-b[0];j=g-b[1];b=a-b[2];m=1/Math.sqrt(c*c+j*j+b*b);c*=m;j*=m;b*=m;k=h*b-i*j;i=i*c-f*b;f=f*j-h*c;if(m=Math.sqrt(k*k+i*i+f*f)){m=1/m;k*=m;i*=m;f*=m}else f=i=k=0;h=j*f-b*i;l=b*k-c*f;o=c*i-j*k;if(m=Math.sqrt(h*h+l*l+o*o)){m=1/m;h*=m;l*=m;o*=m}else o=l=h=0;d[0]=k;d[1]=h;d[2]=c;d[3]=0;d[4]=i;d[5]=l;d[6]=j;d[7]=0;d[8]=f;d[9]=
o;d[10]=b;d[11]=0;d[12]=-(k*e+i*g+f*a);d[13]=-(h*e+l*g+o*a);d[14]=-(c*e+j*g+b*a);d[15]=1;return d};mat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+", "+a[4]+", "+a[5]+", "+a[6]+", "+a[7]+", "+a[8]+", "+a[9]+", "+a[10]+", "+a[11]+", "+a[12]+", "+a[13]+", "+a[14]+", "+a[15]+"]"};quat4={};quat4.create=function(a){var b=new glMatrixArrayType(4);if(a){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3]}return b};quat4.set=function(a,b){b[0]=a[0];b[1]=a[1];b[2]=a[2];b[3]=a[3];return b};
quat4.calculateW=function(a,b){var c=a[0],d=a[1],e=a[2];if(!b||a==b){a[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return a}b[0]=c;b[1]=d;b[2]=e;b[3]=-Math.sqrt(Math.abs(1-c*c-d*d-e*e));return b};quat4.inverse=function(a,b){if(!b||a==b){a[0]*=1;a[1]*=1;a[2]*=1;return a}b[0]=-a[0];b[1]=-a[1];b[2]=-a[2];b[3]=a[3];return b};quat4.length=function(a){var b=a[0],c=a[1],d=a[2];a=a[3];return Math.sqrt(b*b+c*c+d*d+a*a)};
quat4.normalize=function(a,b){b||(b=a);var c=a[0],d=a[1],e=a[2],g=a[3],f=Math.sqrt(c*c+d*d+e*e+g*g);if(f==0){b[0]=0;b[1]=0;b[2]=0;b[3]=0;return b}f=1/f;b[0]=c*f;b[1]=d*f;b[2]=e*f;b[3]=g*f;return b};quat4.multiply=function(a,b,c){c||(c=a);var d=a[0],e=a[1],g=a[2];a=a[3];var f=b[0],h=b[1],i=b[2];b=b[3];c[0]=d*b+a*f+e*i-g*h;c[1]=e*b+a*h+g*f-d*i;c[2]=g*b+a*i+d*h-e*f;c[3]=a*b-d*f-e*h-g*i;return c};
quat4.multiplyVec3=function(a,b,c){c||(c=b);var d=b[0],e=b[1],g=b[2];b=a[0];var f=a[1],h=a[2];a=a[3];var i=a*d+f*g-h*e,j=a*e+h*d-b*g,k=a*g+b*e-f*d;d=-b*d-f*e-h*g;c[0]=i*a+d*-b+j*-h-k*-f;c[1]=j*a+d*-f+k*-b-i*-h;c[2]=k*a+d*-h+i*-f-j*-b;return c};quat4.toMat3=function(a,b){b||(b=mat3.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=k+g;b[4]=1-(j+e);b[5]=d-f;b[6]=c-h;b[7]=d+f;b[8]=1-(j+l);return b};
quat4.toMat4=function(a,b){b||(b=mat4.create());var c=a[0],d=a[1],e=a[2],g=a[3],f=c+c,h=d+d,i=e+e,j=c*f,k=c*h;c=c*i;var l=d*h;d=d*i;e=e*i;f=g*f;h=g*h;g=g*i;b[0]=1-(l+e);b[1]=k-g;b[2]=c+h;b[3]=0;b[4]=k+g;b[5]=1-(j+e);b[6]=d-f;b[7]=0;b[8]=c-h;b[9]=d+f;b[10]=1-(j+l);b[11]=0;b[12]=0;b[13]=0;b[14]=0;b[15]=1;return b};quat4.slerp=function(a,b,c,d){d||(d=a);var e=c;if(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3]<0)e=-1*c;d[0]=1-c*a[0]+e*b[0];d[1]=1-c*a[1]+e*b[1];d[2]=1-c*a[2]+e*b[2];d[3]=1-c*a[3]+e*b[3];return d};
quat4.str=function(a){return"["+a[0]+", "+a[1]+", "+a[2]+", "+a[3]+"]"};

//============================================================
//	OnLoad
//============================================================

function WalkerOne(){
	"use strict";
	let cnvs = document.getElementById('canvas'),
		cntrls = {},
		gl = {},
		views = {},
		light00 = {},
		triangleShader = {},
		TriBuffer = {},
		EquinoxFloor = {},
		modelMatrix		= mat4.identity(mat4.create()),
		viewMatrix		= mat4.identity(mat4.create()),
		eyeMatrix		= mat4.identity(mat4.create()),
		projMatrix		= mat4.identity(mat4.create()),
		vepMatrix		= mat4.identity(mat4.create()),
		mvpMatrix		= mat4.identity(mat4.create()),
		invMatrix		= mat4.identity(mat4.create()),
		texMatrix		= mat4.identity(mat4.create()),
		lgtMatrix		= mat4.identity(mat4.create()),
		dvMatrix		= mat4.identity(mat4.create()),
		dpMatrix		= mat4.identity(mat4.create()),
		dvpMatrix		= mat4.identity(mat4.create());
	
	const TRI_BUFFER_SIZE = 4096,
			WalkerBody_SCALE = 1,
			SIGHT_LENGTH = 3*2,
			SIGHT_HEIGHT = 2,
			VELOCITY = 0.01,
			ROT_RATE = 0.003;
	const	walkerInitRot = [ 0,0,0,0.15,0.80,0 ];
	const	walkerInitPos = [ 0,1.2,0,3 ];
	let floorPos = [ 0, 0, 0 ];
	
	try{
		if( !window.WebGLRenderingContext ){
			alert("No GL context.");
			return;
		}
		gl = cnvs.getContext('webgl') || cnvs.getContext('experimental-webgl');
		if( !gl ){
			alert("Fail to create GL.\r\nPlease use Chrome or FireFox.");
			return;
		}
	}catch( e ){
		alert("Catch: Fail to create GL.\r\nPlease use Chrome or FireFox.");
		return;
	}
	// ブラウザごとのキーイベント名称を取得
	let keyEventNames = getKeyEventNames( fDWL.getBrowserInfo( gl ) );
	
	cnvs.width  = 512;
	cnvs.height = 384;
	
	// キーイベント
	let keyStatus = [ false, false, false, false, false, false, false, false, false ];
	let keyBackup = [ false, false, false, false, false, false, false, false, false ];
	if( window.addEventListener ){
		function KeyDownFunc( evt ){
			"use strict";
			const keyname = evt.key;
			if( keyname === keyEventNames.up ){
				keyStatus[0] = true;
			}
			if( keyname === keyEventNames.down ){
				keyStatus[1] = true;
			}
			if( keyname === keyEventNames.left ){
				keyStatus[2] = true;
			}
			if( keyname === keyEventNames.right ){
				keyStatus[3] = true;
			}
			if( keyname === keyEventNames.shift ){
				keyStatus[4] = true;
			}
			if( keyname === keyEventNames.keyB ){
				keyStatus[5] = true;
			}
			if( keyname === keyEventNames.ctrl ){
				keyStatus[6] = true;
			}
			if( keyname === keyEventNames.space ){
				keyStatus[7] = true;
			}
			if( keyname === keyEventNames.keyR ){
				keyStatus[8] = true;
			}
		}
		
		function KeyUpFunc( evt ){
			"use strict";
			const keyname = evt.key;
			if( keyname === keyEventNames.up ){
				keyStatus[0] = false;
			}
			if( keyname === keyEventNames.down ){
				keyStatus[1] = false;
			}
			if( keyname === keyEventNames.left ){
				keyStatus[2] = false;
			}
			if( keyname === keyEventNames.right ){
				keyStatus[3] = false;
			}
			if( keyname === keyEventNames.shift ){
				keyStatus[4] = false;
			}
			if( keyname === keyEventNames.keyB ){
				keyStatus[5] = false;
			}
			if( keyname === keyEventNames.ctrl ){
				keyStatus[6] = false;
			}
			if( keyname === keyEventNames.space ){
				keyStatus[7] = false;
			}
			if( keyname === keyEventNames.keyR ){
				keyStatus[8] = false;
			}
		}
		// ドキュメントにリスナーを登録
		document.addEventListener( "keydown", KeyDownFunc, false );
		document.addEventListener( "keyup", KeyUpFunc, false );
		
	}
	
	// 移動方向
	let moveXZ = {
		rot:	Math.PI/2,					// 移動方向
		vel:	0.0,				// 移動量
		dif:	[ 0.0, 0.0 ]		// 実移動量(偏差)
	};
	
	// 視線ベクトル
	views = {
		eyePosition:	[ 0,  SIGHT_HEIGHT, SIGHT_LENGTH*2 ],
		lookAt:			[ 0, 0, -4 ],
		height:			1
	};
	
	// 光源・環境光関連
	light00 = {
		position:	 [ -1.0, 20.0, 0.0 ],
		upDirection: [ 0.0, 0.0, 1.0 ],
		ambient:	 [ 0.3, 0.3, 0.3, 1.0 ]
	};
	
	// 三角バッファ用シェーダ作成
	triangleShader.prg = createShaderProgram( gl, 'triangle_vs', 'triangle_fs' );
	triangleShader.attrLoc = [
		gl.getAttribLocation( triangleShader.prg, 'aVertexPosition' ),
		gl.getAttribLocation( triangleShader.prg, 'aVertexNormal' ),
		gl.getAttribLocation( triangleShader.prg, 'aVertexColor' )
	];
	triangleShader.attrStride = [ 3, 3, 4 ];
	triangleShader.uniLoc = [
		gl.getUniformLocation( triangleShader.prg, 'mvpMatrix' ),
		gl.getUniformLocation( triangleShader.prg, 'invMatrix' ),
		gl.getUniformLocation( triangleShader.prg, 'lightPosition' ),
		gl.getUniformLocation( triangleShader.prg, 'eyeDirection' ),
		gl.getUniformLocation( triangleShader.prg, 'ambientColor' )
	];
	gl.enableVertexAttribArray( triangleShader.attrLoc[0] );
	gl.enableVertexAttribArray( triangleShader.attrLoc[1] );
	gl.enableVertexAttribArray( triangleShader.attrLoc[2] );
	
	triangleShader.setUniLoc = function( mvpMtx, invMtx, lgtPos, viewDir, color ){
		"use strict";
		var uniLoc = this.uniLoc;
		gl.uniformMatrix4fv( uniLoc[0], false, mvpMtx );
		gl.uniformMatrix4fv( uniLoc[1], false, invMtx );
		gl.uniform3fv( uniLoc[2], light00.position );
		gl.uniform3fv( uniLoc[3], views.eyePosition );
		gl.uniform4fv( uniLoc[4], light00.ambient );
	};
	triangleShader.setProgram = function( param ){
		"use strict";
		var uniLoc = this.uniLoc;
		gl.useProgram( this.prg );
		gl.uniformMatrix4fv( uniLoc[0], false, param[1] );
		gl.uniformMatrix4fv( uniLoc[1], false, param[2] );
		gl.uniform3fv( uniLoc[2], param[3] );
		gl.uniform3fv( uniLoc[3], param[4] );
		gl.uniform4fv( uniLoc[4], param[5] );
	};
	TriBuffer = new fDWL.R4D.TriangleBuffer( gl, TRI_BUFFER_SIZE );
	
	// 足の移動目標座標
	const LgMvTargPos0 = 0;
	const LgMvTargPosW = 1;
	const LgMvTargPosF = 2;
	const LgMvTargPosB = 3;
	const LgMvTargPosR = 4;
	const LgMvTargPosL = 5;
	const LgMvStride = 2;
	const LgMvStrideH = LgMvStride/2;
	// 回転移動用移動開始・終了点算出用
	const stdLegPosLen = Math.sqrt( 5.21 );
	const stdLPX = -1.1/stdLegPosLen;
	const stdLPZ = 2/stdLegPosLen;
	// 移動コマンド
	const CmdNop = 0;					// 教養コマンド：動作なし
	const CmdMvStop = CmdNop+1;			// 停止
	const CmdMvFwd = CmdMvStop+1;		// 前進
	const CmdMvBack = CmdMvFwd+1;		// 後進
	const CmdMvPw2Pb2 = CmdMvBack+1;	// 停止準備から停止作業へ
	const CmdMvTurnR = CmdMvPw2Pb2+1;	// 右回転
	const CmdMvTurnL = CmdMvTurnR+1;	// 左回転
	const CmdMvMax = CmdMvTurnL+1;
	// 足へ／からのコマンド
	const CmdLgF = CmdMvMax+1;			// 脚かき動作
	const CmdLgB = CmdLgF+1;			// 脚上げ復帰動作
	const CmdLgW = CmdLgB+1;			// その場で待機
	const CmdLgEnd = CmdLgW+1;			// 動作終了(目標地点到達)
	// 足のState
	const StateW  = 0;				// 待機中
	const StateNf = StateW+1;		// 通常移動中
	const StateNb = StateNf+1;		// 通常復帰中
	const StatePw = StateNb+1;		// 停止準備待機中
	const StatePb = StatePw+1;		// 停止準備移動中(陽)
	const StatePb2 = StatePb+1;		// 停止準備移動中(陰)
	// コマンドリストID(=LegID)
	const CmdListLg = 0;
	const CmdListLg0 = CmdListLg;
	const CmdListLg1 = CmdListLg0+1;
	const CmdListLg2 = CmdListLg1+1;
	const CmdListLg3 = CmdListLg2+1;
	const CmdListLg4 = CmdListLg3+1;
	const CmdListLg5 = CmdListLg4+1;
	const CmdListLg6 = CmdListLg5+1;
	const CmdListLg7 = CmdListLg6+1;
	const CmdListOut = CmdListLg7+1;
	const CmdListMax = CmdListOut+1;
	
	
	// 足の動作コントローラ
	let LegBrain = {
		
		// 現状の全体コマンド
		MainCmd:	CmdNop,
		// 保存中の次回コマンド
		NextCmd:	CmdNop,
		// 各脚
		LegObj:		[ null, null, null, null, null, null, null, null ],
		// 脚のステート
		LegState:	[ StateW, StateW, StateW, StateW, StateW, StateW, StateW, StateW ],
		// 足のモード(Master/Slave)
		LegMode:	[ false, true, true, false, true, false, false, true ],
		// コマンドリスト：コマンドの郵便受け
		CmdList:	[ CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop, CmdNop ],
		// 足の基準位置
		StdLegPos:	[
			[ 1.5, -0.5, 1.1, 1.5 ], [ -1.5, -0.5, 1.1, 1.5 ], [ 1.5, -0.5, -1.1, 1.5 ], [ -1.5, -0.5, -1.1, 1.5 ],
			[ 1.5, -0.5, 1.1,-1.5 ], [ -1.5, -0.5, 1.1,-1.5 ], [ 1.5, -0.5, -1.1,-1.5 ], [ -1.5, -0.5, -1.1,-1.5 ]
		],
		// 前進時の目標地点
		FwdLegPos:	[
			[ 1.5, -0.5, 0.1, 1.5 ], [ -1.5, -0.5, 0.1, 1.5 ], [ 1.5, -0.5, -2.1, 1.5 ], [ -1.5, -0.5, -2.1, 1.5 ], 
			[ 1.5, -0.5, 0.1,-1.5 ], [ -1.5, -0.5, 0.1,-1.5 ], [ 1.5, -0.5, -2.1,-1.5 ], [ -1.5, -0.5, -2.1,-1.5 ]
		],
		// 後退時の目標地点
		BckLegPos:	[
			[ 1.5, -0.5, 2.1, 1.5 ], [ -1.5, -0.5, 2.1, 1.5 ], [ 1.5, -0.5, -0.1, 1.5 ], [ -1.5, -0.5, -0.1, 1.5 ],
			[ 1.5, -0.5, 2.1,-1.5 ], [ -1.5, -0.5, 2.1,-1.5 ], [ 1.5, -0.5, -0.1,-1.5 ], [ -1.5, -0.5, -0.1,-1.5 ]
		],
		// X-Z平面右回転時の目標地点
		RitLegPosX:	[
			[ 1.5+stdLPX, -0.5, 1.1+stdLPZ, 1.5 ], [ -1.5+stdLPX, -0.5, 1.1-stdLPZ, 1.5 ], [ 1.5-stdLPX, -0.5, -1.1+stdLPZ, 1.5 ], [ -1.5-stdLPX, -0.5, -1.1-stdLPZ, 1.5 ],
			[ 1.5+stdLPX, -0.5, 1.1+stdLPZ,-1.5 ], [ -1.5+stdLPX, -0.5, 1.1-stdLPZ,-1.5 ], [ 1.5-stdLPX, -0.5, -1.1+stdLPZ,-1.5 ], [ -1.5-stdLPX, -0.5, -1.1-stdLPZ,-1.5 ]
		],
		// X-Z平面左回転時の目標地点
		LftLegPosX:	[
			[ 1.5-stdLPX, -0.5, 1.1-stdLPZ, 1.5 ], [ -1.5-stdLPX, -0.5, 1.1+stdLPZ, 1.5 ], [ 1.5+stdLPX, -0.5, -1.1-stdLPZ, 1.5 ], [ -1.5+stdLPX, -0.5, -1.1+stdLPZ, 1.5 ],
			[ 1.5-stdLPX, -0.5, 1.1-stdLPZ,-1.5 ], [ -1.5-stdLPX, -0.5, 1.1+stdLPZ,-1.5 ], [ 1.5+stdLPX, -0.5, -1.1-stdLPZ,-1.5 ], [ -1.5+stdLPX, -0.5, -1.1+stdLPZ,-1.5 ]
		],
		// H-Z平面右回転時の目標地点
		RitLegPosH:	[
			[ 1.5+stdLPX, -0.5, 1.1+stdLPZ, 1.5 ], [ -1.5+stdLPX, -0.5, 1.1-stdLPZ, 1.5 ], [ 1.5-stdLPX, -0.5, -1.1+stdLPZ, 1.5 ], [ -1.5-stdLPX, -0.5, -1.1-stdLPZ, 1.5 ],
			[ 1.5+stdLPX, -0.5, 1.1+stdLPZ,-1.5 ], [ -1.5+stdLPX, -0.5, 1.1-stdLPZ,-1.5 ], [ 1.5-stdLPX, -0.5, -1.1+stdLPZ,-1.5 ], [ -1.5-stdLPX, -0.5, -1.1-stdLPZ,-1.5 ]
		],
		// H-Z平面左回転時の目標地点
		LftLegPosH:	[
			[ 1.5, -0.5, 1.1-stdLPZ, 1.5-stdLPX ], [ -1.5, -0.5, 1.1+stdLPZ, 1.5-stdLPX ], [ 1.5, -0.5, -1.1-stdLPZ, 1.5+stdLPX ], [ -1.5, -0.5, -1.1+stdLPZ, 1.5+stdLPX ],
			[ 1.5, -0.5, 1.1-stdLPZ,-1.5-stdLPX ], [ -1.5, -0.5, 1.1+stdLPZ,-1.5-stdLPX ], [ 1.5, -0.5, -1.1-stdLPZ,-1.5+stdLPX ], [ -1.5, -0.5, -1.1+stdLPZ,-1.5+stdLPX ]
		],
		
		// 各脚へのコマンド発行
		// outerCmd: 受け取ったコマンド(動作終了通知も含む)
		// lgNo: 脚の番号
		sndCmd: function( outerCmd, lgNo ){
			let cmd = [ CmdNop, 0, 0, 0, 0 ];	// CmdID, TargetPos
			let trgPos = LgMvTargPos0;
			
			if( outerCmd === this.MainCmd ){
				return;
			}
			
			switch( outerCmd ){
			case CmdMvStop:
				// Stop命令が動作するのは移動(Nf/Nb)時のみ
				if( this.LegState[lgNo] === StateNf ){
					// その場で待機
					this.LegState[lgNo] = StatePw;
					cmd[0] = CmdLgW;
				}else
				if( this.LegState[lgNo] === StateNb ){
					// 標準位置への復帰作業
					this.LegState[lgNo] = StatePb;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
				}
				break;
			case CmdMvFwd:
				// 前進命令
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosB;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvBack ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvBack ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosB;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvBack:
				// 後退命令
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosF;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosB;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvFwd ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosB;
					}else
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosF;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvFwd ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosF;
					}else
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosB;
					}
					break;
				default:
					break;
				}
				break;
			case CmdLgEnd:
				// 動作終了通知
				switch( this.LegState[lgNo] ){
				case StateNf:
					this.LegState[lgNo] = StateNb;
					cmd[0] = CmdLgB;
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosF;
					}else
					if( this.MainCmd === CmdMvTurnR ){
						trgPos = LgMvTargPosR;
					}else
					if( this.MainCmd === CmdMvTurnL ){
						trgPos = LgMvTargPosL;
					}else{
						trgPos = LgMvTargPosB;
					}
					break;
				case StateNb:
					this.LegState[lgNo] = StateNf;
					cmd[0] = CmdLgF;
					if( this.MainCmd === CmdMvBack ){
						trgPos = LgMvTargPosB;
					}else
					if( this.MainCmd === CmdMvTurnR ){
						trgPos = LgMvTargPosL;
					}else
					if( this.MainCmd === CmdMvTurnL ){
						trgPos = LgMvTargPosR;
					}else{
						trgPos = LgMvTargPosF;
					}
					break;
				case StatePw:
					this.LegState[lgNo] = StatePb2;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
					break;
				case StatePb:
				case StatePb2:
					this.LegState[lgNo] = StateW;
					trgPos = LgMvTargPosW;
					break;
				default:
					break;
				}
				break;
			case CmdMvTurnR:
				// 右回転
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosR;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosL;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvTurnL ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosL;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvTurnL ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosR;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvTurnL:
				// 左回転
				switch( this.LegState[lgNo] ){
				case StateW:
					if( this.LegMode[lgNo] ){
						this.LegState[lgNo] = StateNb;
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosL;
					}else{
						this.LegState[lgNo] = StateNf;
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosR;
					}
					break;
				case StateNf:
					if( this.MainCmd === CmdMvTurnR ){
						cmd[0] = CmdLgF;
						trgPos = LgMvTargPosR;
					}
					break;
				case StateNb:
					if( this.MainCmd === CmdMvTurnR ){
						cmd[0] = CmdLgB;
						trgPos = LgMvTargPosL;
					}
					break;
				default:
					break;
				}
				break;
			case CmdMvPw2Pb2:
				// デバグ用：終了待機から終了動作へ
				if( this.LegState[lgNo] === StatePw ){
					this.LegState[lgNo] = StatePb2;
					cmd[0] = CmdLgB;
					trgPos = LgMvTargPosW;
				}
				break;
			default:
				break;
			}
			if( trgPos !== LgMvTargPos0 ){
				if( trgPos === LgMvTargPosF ){
					cmd[1] = this.FwdLegPos[lgNo][0], cmd[2] = this.FwdLegPos[lgNo][1], cmd[3] = this.FwdLegPos[lgNo][2], cmd[4] = this.FwdLegPos[lgNo][3];
				}else
				if( trgPos === LgMvTargPosB ){
					cmd[1] = this.BckLegPos[lgNo][0], cmd[2] = this.BckLegPos[lgNo][1], cmd[3] = this.BckLegPos[lgNo][2], cmd[4] = this.BckLegPos[lgNo][3];
				}else
				if( trgPos === LgMvTargPosR ){
					cmd[1] = this.RitLegPosX[lgNo][0], cmd[2] = this.RitLegPosX[lgNo][1], cmd[3] = this.RitLegPosX[lgNo][2], cmd[4] = this.RitLegPosX[lgNo][3];
				}else
				if( trgPos === LgMvTargPosL ){
					cmd[1] = this.LftLegPosX[lgNo][0], cmd[2] = this.LftLegPosX[lgNo][1], cmd[3] = this.LftLegPosX[lgNo][2], cmd[4] = this.LftLegPosX[lgNo][3];
				}else{		// LgMvTargPosW
					cmd[1] = this.StdLegPos[lgNo][0], cmd[2] = this.StdLegPos[lgNo][1], cmd[3] = this.StdLegPos[lgNo][2], cmd[4] = this.StdLegPos[lgNo][3];
				}
			}
			if( this.LegObj[ lgNo ] ){
				this.LegObj[lgNo].rcvCmd( cmd );
			}
			//return cmd;
		},
		
		// コマンド受信：コマンド受信リストに登録
		rcvCmd: function( outerCmd, lgNo ){
			if(( CmdListLg0 <= lgNo )&&( lgNo < CmdListMax )){
				
				// 動作中ならStopに差し替え
				if( ( lgNo === CmdListOut )&&
					((( outerCmd === CmdMvFwd )||( outerCmd === CmdMvBack ))&&(( this.MainCmd === CmdMvTurnR )||( this.MainCmd === CmdMvTurnL )))||
					((( outerCmd === CmdMvTurnR )||( outerCmd === CmdMvTurnL ))&&(( this.MainCmd === CmdMvFwd )||( this.MainCmd === CmdMvBack )))
				){
					this.NextCmd = outerCmd;	// 入力を保存
					outerCmd = CmdMvStop;		// 動作停止を実行
				}
				// コマンドリストに登録
				this.CmdList[lgNo] = outerCmd;
			}
		},
		// コマンド受信：コマンド受信リストをチェック
		checkCmdList: function(){
			let cmd = CmdNop;
			// 各脚からのコマンドをチェック：CmdLgEnd でなければNop
			for( let lgNo = CmdListLg0; lgNo < CmdListMax; lgNo++ ){
				cmd = this.CmdList[lgNo];
				if( cmd === CmdNop ){
					continue;
				}
				if( lgNo !== CmdListOut ){
					// 脚からの終了通知：自身に通知
					this.sndCmd( cmd, lgNo );
					// 終了動作待機中ならペアの片割れにも通知
					let pairNo = this.getPairNo( lgNo );
					if( this.LegState[pairNo] === StatePw ){
						this.sndCmd( cmd, pairNo );
					}
					// 全動作終了なら、次回コマンドを発行
					if( this.CmdList[CmdListOut] === CmdNop ){
						for( let idx = 0; idx < this.LegState.length; ++idx ){
							if( this.LegState[idx] !== StateW ){
								break;
							}
							this.CmdList[CmdListOut] = this.NextCmd;
							this.NextCmd = CmdNop;
						}
					}
				}else{
					// 各脚に通達
					for( let idx = CmdListLg0; idx < CmdListOut; idx++ ){
						this.sndCmd( cmd, idx );
					}
					this.MainCmd = cmd;
				}
				this.CmdList[lgNo] = CmdNop;
			}
		},
		// 動作を初期化
		resetPos:	function(){
			this.rcvCmd( CmdMvStop, CmdListOut );
		},
		
		// 脚のペアの相手を返す
		getPairNo: function( lgNo ){
			let pairNo = 0;
			switch( lgNo ){
			case 0:
			case 2:
			case 4:
			case 6:
				pairNo = lgNo+1;
				break;
			case 1:
			case 3:
			case 5:
			case 7:
				pairNo = lgNo-1;
				break;
			default :
				pairNo = 0;
				break;
			}
			return pairNo;
		}
	};
	
	const LegBaseHeight = -0.5;
	const LEG_NUM = 8;				// 脚の本数
	// Leg of Walkers
	let LegSet = function( legNo, pos, rotate, shader, brain ){
		this.id = legNo;
		this.pos = pos.concat();						// LegSet全体の4次元座標
		this.brain = brain;
		this.rot = rotate;
		this.basePos = [ 0,0,0,0 ];							// 常に0
		this.anklePos = [ brain.StdLegPos[legNo].concat() ];	// basePosからの相対位置
		this.kneePos = [ 0,0,0,0 ];							// basePosからの相対位置
		this.rotate = [ 0,0,0,0,0,0 ];						// LegSet全体の回転角
		this.scale = [ 1,1,1,0 ];
		this.shader = shader;
		this.State = StateW;								// 脚の移動モード(State)
		this.targetPos = [ 0,0,0,0 ];
		this.srcPos = [ 0,0,0, ];
		
		this.Base  = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
		this.Knee  = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
		this.Ankle = new fDWL.D4D.Sphere4D( gl, [ 0,0,0,0 ], [ 0,0,0,0,0,0 ], 8, 8, 0.2, [ 0.8, 0.8, 1.0, 1.0 ], shader );
		this.UpperLeg = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0,0,0,0 ],									// pos
			[ 0,0,0,0,0,0 ],								// rotate
			[ 1,1,1,1 ],
			[ // Vertice
				-0.1,  1, 0.1,  0.1,   0.1,  1, 0.1,  0.1,   -0.1,  1, -0.1,  0.1,    0.1,  1, -0.1,  0.1,
				 0.1, -1, 0.1,  0.1,  -0.1, -1, 0.1,  0.1,    0.1, -1, -0.1,  0.1,   -0.1, -1, -0.1,  0.1,
				-0.1,  1, 0.1, -0.1,   0.1,  1, 0.1, -0.1,   -0.1,  1, -0.1, -0.1,    0.1,  1, -0.1, -0.1,
				 0.1, -1, 0.1, -0.1,  -0.1, -1, 0.1, -0.1,    0.1, -1, -0.1, -0.1,   -0.1, -1, -0.1, -0.1
				//,0, -1, 0, 0,  0, 1, 0, 0
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);
		this.LowerLeg = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],								// pos
			[ 0,0,0,0,0,0 ],							// rotate
			[ 1, 1, 1, 1 ],
			[ // Vertice
				-0.1,  1, 0.1,  0.1,   0.1,  1, 0.1,  0.1,   -0.1,  1, -0.1,  0.1,    0.1,  1, -0.1,  0.1,
				 0.1, -1, 0.1,  0.1,  -0.1, -1, 0.1,  0.1,    0.1, -1, -0.1,  0.1,   -0.1, -1, -0.1,  0.1,
				-0.1,  1, 0.1, -0.1,   0.1,  1, 0.1, -0.1,   -0.1,  1, -0.1, -0.1,    0.1,  1, -0.1, -0.1,
				 0.1, -1, 0.1, -0.1,  -0.1, -1, 0.1, -0.1,    0.1, -1, -0.1, -0.1,   -0.1, -1, -0.1, -0.1
				//,0, -1, 0, 0,  0, 1, 0, 0
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);		
		this.Foot = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],								// pos
			[ 0,0,0,0,0,0 ],							// rotate
			[ 1, 1, 1, 1 ],
			[ // Vertice
				-0.3, 0.1,  0.3,  0.3,   0.3, 0.1,  0.3,  0.3,   -0.3, -0.1,  0.3,  0.3,    0.3, -0.1,  0.3,  0.3,
				 0.3, 0.1, -0.3,  0.3,  -0.3, 0.1, -0.3,  0.3,    0.3, -0.1, -0.3,  0.3,   -0.3, -0.1, -0.3,  0.3,
				-0.3, 0.1,  0.3, -0.3,   0.3, 0.1,  0.3, -0.3,   -0.3, -0.1,  0.3, -0.3,    0.3, -0.1,  0.3, -0.3,
				 0.3, 0.1, -0.3, -0.3,  -0.3, 0.1, -0.3, -0.3,    0.3, -0.1, -0.3, -0.3,   -0.3, -0.1, -0.3, -0.3
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
				 0, 1, 2, 8,  1, 2, 3,11,   8, 9,11, 1,   8,11,10, 2,   1, 2, 8,11,		// 手前(Z=+1)
				13,12,15, 5, 12,15,14, 6,   5, 4, 6,12,   5, 6, 7,15,  12,15, 5, 6		// 奥(Z=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, -0.1, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);		
		// 足の長さを指定
		this.UpperLeg.legLen = 2.0;
		this.LowerLeg.legLen = 2.0;
		
	}
	LegSet.prototype = {
		
		initParts:	function( primBuffer ){
			// シェーディングルーチン選択
			this.UpperLeg.setTriangle = this.UpperLeg.setTriangleFlat;
			this.UpperLeg.getNormal = this.UpperLeg.getNormalPlane;
			this.UpperLeg.getColor = this.UpperLeg.getColorPlane;
			this.LowerLeg.setTriangle = this.UpperLeg.setTriangleFlat;
			this.LowerLeg.getNormal = this.UpperLeg.getNormalPlane;
			this.LowerLeg.getColor = this.UpperLeg.getColorPlane;
			this.Foot.setTriangle = this.UpperLeg.setTriangleFlat;
			this.Foot.getNormal = this.UpperLeg.getNormalPlane;
			this.Foot.getColor = this.UpperLeg.getColorPlane;
			//  初期位置設定
			this.targetPos = this.brain.StdLegPos[this.id];
			this.srcPos = this.brain.StdLegPos[this.id];
			this.anklePos = this.targetPos.concat();
			// 初期化変換
			this.UpperLeg.transform();
			this.UpperLeg.setTriBuffer( primBuffer );
			this.LowerLeg.transform();
			this.LowerLeg.setTriBuffer( primBuffer );
			this.Foot.transform();
			this.Foot.setTriBuffer( primBuffer );
		},
		
		// 位置・角度等再設定
		resetPos:	function( param ){
			this.State = StateW;								// 脚の移動モード(State)
			this.targetPos = this.brain.StdLegPos[this.id];
			this.srcPos = this.brain.StdLegPos[this.id];
		},
		
		setPos: function( pos ){
			this.pos = pos;
		},
		
		// 本体からのコマンド受信
		rcvCmd: function( cmd ){
			switch( cmd[0] ){
			case CmdLgF:	// 脚かき動作
				this.targetPos = [ cmd[1],cmd[2],cmd[3],cmd[4] ];
				if(( this.State === StateW )||( this.State === StateNb )){
					this.State = StateNf;
				}
				break;
			case CmdLgB:	// 脚上げ復帰動作
				this.targetPos = [ cmd[1],cmd[2],cmd[3],cmd[4] ];
				if(( this.State === StateW )||( this.State === StateNf )){
					this.State = StateNb;
				}
				break;
			case CmdLgW:	// その場で待機
				this.State = StateW;
				break;
			case CmdNop:
			default:
				break;
			}
		},
		
		// 関節位置変更実験
		walk: function( pos, wkrMtx, wkrPos, wkrRot, dist ){
			
			// 基点と上腿
			//this.basePos = [ 0,0,0,0 ];
			// 足と下腿
			this.anklePos = this.calcAnklePos( dist );
			// 膝位置
			this.kneePos  = this.calcKneePos();
			
			let rotUpper = this.calcRotate( this.basePos,  this.anklePos, wkrRot );
			let rotLower = rotUpper.concat();
			rotUpper[1] =  this.calcRotateYZ( this.basePos,  this.kneePos, this.UpperLeg.legLen );
			rotLower[1] = -this.calcRotateYZ( this.anklePos, this.kneePos, this.LowerLeg.legLen );
			this.UpperLeg.setRotate( rotUpper );
			this.LowerLeg.setRotate( rotLower );
			
			// 各パーツに座標・角度を設定
			// LegPos( = base )
			this.pos = fDWL.add4D( wkrMtx.mulVec( pos[0], pos[1], pos[2], pos[3] ), wkrPos );
			// base
			let basePos = this.pos.concat();
			this.Base.setPos( basePos );
			this.UpperLeg.setPos( basePos );
			// ankle
			let anklePos = fDWL.add4D( wkrMtx.mulVec( this.anklePos[0], this.anklePos[1], this.anklePos[2], this.anklePos[3] ), basePos );
			this.Ankle.setPos( anklePos );
			this.Foot.setPos( anklePos );
			this.LowerLeg.setPos( anklePos );
			// knee
			let kneePos = fDWL.add4D( wkrMtx.mulVec( this.kneePos[0], this.kneePos[1], this.kneePos[2], this.kneePos[3] ), basePos );
			this.Knee.setPos( kneePos );
			
			// 移動終了チェック
			if(( this.anklePos[0] === this.targetPos[0] )&&( this.anklePos[1] === this.targetPos[1] )&&( this.anklePos[2] === this.targetPos[2] )&&( this.anklePos[3] === this.targetPos[3] )){
				// 終了通知を発信
				this.brain.rcvCmd( CmdLgEnd, this.id );
			}
		},
		
		// 踝の位置を算出：仮
		calcAnklePos: function( speed ){
			let anklePos = this.anklePos.concat();
			
			if( ( this.State === StateNf )||
				( this.State === StateNb )||
				( this.State === StatePb )||
				( this.State === StatePb2 )
			){
				const difH = 0.1;
				let movDir = [ this.targetPos[0]-anklePos[0], 0, this.targetPos[2]-anklePos[2], this.targetPos[3]-anklePos[3] ];
				const mvSize = Math.sqrt( fDWL.inProd4D( movDir, movDir ) );
				if( mvSize < speed ){
					// 移動先に元々近ければ移動先を直接指定
					anklePos[0] = this.targetPos[0];
					anklePos[2] = this.targetPos[2];
					anklePos[3] = this.targetPos[3];
					
					// 高さの差が大きい場合は修正限界を考慮する
					if( anklePos[1] > (this.targetPos[1]+difH) ){
						anklePos[1] -= difH;
					}else
					if( anklePos[1] < (this.targetPos[1]-difH) ){
						anklePos[1] += difH;
					}else{
						anklePos[1] = this.targetPos[1];
					}
				}else{
					// 移動先から遠ければ、方向づけして移動量を付加
					movDir[0] /= mvSize, movDir[1] /= mvSize, movDir[2] /= mvSize, movDir[3] /= mvSize;
					anklePos[0] += movDir[0]*speed;
					anklePos[1] = -0.5;
					anklePos[2] += movDir[2]*speed;
					anklePos[3] += movDir[3]*speed;
					
					// 脚上げ移動なら脚高度を計算
					if( this.State !== StateNf ){
						const leng = Math.sqrt(
							(this.targetPos[0]-anklePos[0])*(this.targetPos[0]-anklePos[0])+
							(this.targetPos[2]-anklePos[2])*(this.targetPos[2]-anklePos[2])+
							(this.targetPos[3]-anklePos[3])*(this.targetPos[3]-anklePos[3]) );
						const hight = LgMvStrideH - (LgMvStrideH-leng)*(LgMvStrideH-leng)/LgMvStrideH;
						anklePos[1] = this.targetPos[1] + hight;
					}
				}
			}
			return anklePos;
		},
		
		// 膝の座標と足の傾きを計算
		calcKneePos: function(){
			// まずはbasePos[1]=anklePos[1]の場合を算出
			const L02 = this.UpperLeg.legLen*this.UpperLeg.legLen;
			const L12 = this.LowerLeg.legLen*this.LowerLeg.legLen;
			// 距離計算は手抜きできない
			const anklePos = this.anklePos;
			const basePos = this.basePos;
			const difV = [ anklePos[0]-basePos[0], anklePos[1]-basePos[1], anklePos[2]-basePos[2], anklePos[3]-basePos[3] ];
			const D2 = 	difV[0]*difV[0]+difV[1]*difV[1]+difV[2]*difV[2]+difV[3]*difV[3];
			const Dst = Math.sqrt( D2 );
			const DD = Math.sqrt( D2-difV[1]*difV[1] );
			let dist = (D2+L02-L12)/(2*Dst);
			let height = Math.sqrt( L02 - dist*dist );
			const MINIMUM_Y = 0.01;
			if(( difV[1] < -MINIMUM_Y )||( MINIMUM_Y < difV[1] )){
				// 付け根と踝の高度差が大きければ調整
				const sinYZ = -difV[1]/Dst;
				const cosYZ = DD/Dst;
				const newDist   =  dist*cosYZ+height*sinYZ;
				const newHeight = -dist*sinYZ+height*cosYZ;
				dist = newDist;
				height = newHeight;
			}
			let kneePos = basePos.concat();
			const rate = dist/Dst;
			kneePos[0] += rate*difV[0];
			kneePos[1] += height;
			kneePos[2] += rate*difV[2];
			kneePos[3] += rate*difV[3];
			
			return kneePos;
		},
		
		// 基準点２つから傾きを算出：脚の伸び縮み方向
		calcRotateYZ: function( srcPos, dstPos, legLen ){
			const height = dstPos[1]-srcPos[1];
			const ang = Math.PI/2 -Math.asin( height/legLen );
			return ang;
		},
		// 横方向への回転角を求める
		calcRotate: function( srcPos, dstPos, wkrRot ){
			let rotate = [ 0,0,0,0,0,0 ];
			// 確実の偏差
			const difX = dstPos[0]-srcPos[0];
			const difZ = dstPos[2]-srcPos[2];
			const difH = dstPos[3]-srcPos[3];
			
			// z-xh回転を求める
			let lenXH = Math.sqrt( difX*difX + difH*difH );
			let z_xh = Math.atan2( difZ, lenXH );
			z_xh += Math.PI*3/2;
			rotate[4] = z_xh;
			if( rotate[4] > Math.PI*2 ){
				rotate[4] -= Math.PI*2;
			}
			
			// xh回転を求める
			let xh = Math.atan2( difH, difX );
			rotate[5] = xh;
			return rotate;			// [ xy, yz, yh, zh, xz, xh ]
		},
		
		// 描画
		draw:	function( isRedraw, hPos, wkrMtx, viewProjMtx, shaderParam ){
			
			// 描画
			if( isRedraw ){
				
				this.UpperLeg.transform( wkrMtx );
				this.UpperLeg.dividePylams( hPos );
				this.LowerLeg.transform( wkrMtx );
				this.LowerLeg.dividePylams( hPos );
				this.Foot.transform();
				this.Foot.dividePylams( hPos );
			}
			this.Base.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Base.draw( this.shader );
			this.Knee.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Knee.draw( this.shader );
			this.Ankle.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Ankle.draw( this.shader );
		},
	}
	
	// 
	let WalkerOne = function( gl, pos, rotate, shader, brain ){
		this.pos = pos;
		this.rot = rotate;
		this.scale = [ 1,1,1,1 ];
		this.shader = shader;
		this.localMtx = new fDWL.R4D.Matrix4();
		this.brain = brain;
		
		// 胴体部分
		this.Body = new fDWL.R4D.Pylams4D(
			gl,
			shader.prg,
			[ 0, 0, 0, 0 ],			// pos
			this.rot.concat(),									// rotate
			[ WalkerBody_SCALE, WalkerBody_SCALE, WalkerBody_SCALE, WalkerBody_SCALE ],
			[ // Vertice
				-0.5, 0.5,  0.5,  0.5,   0.5, 0.5,  0.5,  0.5,   -0.5, -0.5,  0.5,  0.5,    0.5, -0.5,  0.5,  0.5,
				 0.5, 0.5, -0.5,  0.5,  -0.5, 0.5, -0.5,  0.5,    0.5, -0.5, -0.5,  0.5,   -0.5, -0.5, -0.5,  0.5,
				-0.5, 0.5,  0.5, -0.5,   0.5, 0.5,  0.5, -0.5,   -0.5, -0.5,  0.5, -0.5,    0.5, -0.5,  0.5, -0.5,
				 0.5, 0.5, -0.5, -0.5,  -0.5, 0.5, -0.5, -0.5,    0.5, -0.5, -0.5, -0.5,   -0.5, -0.5, -0.5, -0.5
			],
			// color
			[ 192, 192, 192, 255 ],
			// center
			[ 0, 0, 0, 0 ],
			[	// index of Pylamids
				 0, 1, 2, 5,  1, 2, 3, 6,   4, 5, 6, 1,   5, 6, 7, 2,   1, 2, 5, 6,		// こっち(h=+1)
				 8, 9,10,13,  9,10,11,14,  12,13,14, 9,  13,14,15,10,   9,10,13,14,		// あっち(h=-1)
				 9, 1,11,12,  1,11, 3, 6,   4,12, 6, 1,  11, 6,12,14,   1,11, 6,12,		// 右(X=+1)
				 0, 8, 2, 5,  8, 2,10,15,   5,13,15, 8,   5, 7,15, 2,   2, 8, 5,15,		// 左(X=-1)
				 0, 1, 8, 5,  1, 8, 9,12,   5, 4,12, 1,   5,12,13, 8,   1, 8, 5,12,		// 上(Y=+1)
				 2,10,11,15,  2, 3,11, 6,  15,14, 6,11,  15, 6, 7, 2,   2,11, 6,15,		// 下(Y=-1)
				 0, 1, 2, 8,  1, 2, 3,11,   8, 9,11, 1,   8,11,10, 2,   1, 2, 8,11,		// 手前(Z=+1)
				13,12,15, 5, 12,15,14, 6,   5, 4, 6,12,   5, 6, 7,15,  12,15, 5, 6		// 奥(Z=-1)
			],
			[	// chrnIdx: 各五胞体の構成頂点index
				// 元無し
			],
			[	// centIdx
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0
			],
			[	// color index of pylamid
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 
				0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0
			],
			[ 0, 0, 0, 0 ],				// offs: vertex生成時位置オフセット
			[ 0, 0, 0, 0, 0, 0 ]		// rot:  vertex生成時回転
		);
		this.Body.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		this.BodyPlace = [ 0,0,0,0 ];	// 基準位置
		this.BodyPos = [ 0,0,0,0 ];		// ローカル座標変換結果
		this.Body.resetPos = function( param ){
			this.setPos( param.pos );
			this.setRotate( param.rotate );
		}
		
		// 頭部＆顔
		this.Head = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ], 16, 16, 0.5, [ 0.7, 0.7, 0.7, 1.0 ], shader );
		this.Face = new fDWL.D4D.Sphere4D( gl, [ 0, 0, 0, 0 ], [ 0,0,0,0,0,0 ],  8,  8, 0.3, [ 1.0, 0.7, 0.7, 1.0 ], shader );
		this.HeadPlace = [ 0, 0.8,  0.0, 0 ];	// 基準位置
		this.HeadPos = [ 0,0,0,0 ];				// ローカル座標変換結果
		this.Head.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		this.Head.resetPos = function( param ){
			this.setPos( param.pos );
			this.setRotate( param.rotate );
		}
		this.FacePlace = [ 0, 0.8, 0.5, 0 ];	// 基準位置
		this.FacePos = [ 0,0,0,0 ];				// ローカル座標変換結果
		this.Face.walk = function( pos, rot ){
			this.setPos( pos );
			this.setRotate( rot );
		}
		this.Face.resetPos = function( param ){
			this.setPos( param.pos );
			this.setRotate( param.rotate );
		}
		
		// 脚部
		this.Legs = [];
		this.LegPlace = [
			[ 0.5,LegBaseHeight, 0.5, 0.5 ], [ -0.5,LegBaseHeight, 0.5, 0.5 ],
			[ 0.5,LegBaseHeight,-0.5, 0.5 ], [ -0.5,LegBaseHeight,-0.5, 0.5 ],
			[ 0.5,LegBaseHeight, 0.5,-0.5 ], [ -0.5,LegBaseHeight, 0.5,-0.5 ],
			[ 0.5,LegBaseHeight,-0.5,-0.5 ], [ -0.5,LegBaseHeight,-0.5,-0.5 ]
		];
		this.LegPos = [];
		for( let idx = 0; idx < LEG_NUM; ++idx ){
			this.Legs[idx] = new LegSet( idx, this.LegPlace[idx], [ 0,0,0,0,0,0 ], triangleShader, this.brain );
			this.brain.LegObj[idx] = this.Legs[idx];
			
			this.Legs[idx].resetPos = function( param ){
				//this.setPos( param.pos );
				
			}
		}
		this.resetParam = {};
	}
	
	WalkerOne.prototype = {
		initParts:	function( primBuffer ){
			// シェーディングルーチン選択
			this.Body.setTriangle = this.Body.setTriangleFlat;
			this.Body.getNormal = this.Body.getNormalPlane;
			this.Body.getColor = this.Body.getColorPlane;
			// 初期化変換
			this.Body.transform();
			this.Body.setTriBuffer( primBuffer );
			
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].initParts( primBuffer );
			}
		},
		
		// 位置・角度等再設定
		resetPos:	function(){
			this.pos = this.resetParam.pos;
			this.rot = this.resetParam.rotate;
			this.Body.resetPos( this.resetParam );
			this.Head.resetPos( this.resetParam );
			this.Face.resetPos( this.resetParam );
			this.brain.resetPos();
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].resetPos( this.resetParam );
			}
			//this.isReset = this.resetParam.isReset;
		},
		isReset:	function(){
			return false;
		},
		setIsReset:	function( resetFunc ){
			this.isReset = resetFunc;
		},
		setResetParam: function( param ){
			this.resetParam = param;
		},
		
		setRotate:	function( rotate ){
			this.rot = rotate;
		},
		getRotate: function(){
			return this.rot.concat();
		},
		getPos:	function(){
			return this.pos.concat();
		},
		
		calcRotMtx:	function(){
			// ローカル変換行列の作成
			let mx4Rots = [
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4(),
					new fDWL.R4D.Matrix4()
				];
			for( let idx = 0; idx < 6; ++idx ){
				mx4Rots[idx].makeRot( idx, this.rot[idx] );
			}
			let mx4Scale = new fDWL.R4D.Matrix4();
			mx4Scale.makeScale( this.scale );
			// 各Matrixの合成
			this.localMtx = mx4Scale.
					mul( mx4Rots[5] ).
					mul( mx4Rots[4] ).
					mul( mx4Rots[3] ).
					mul( mx4Rots[2] ).
					mul( mx4Rots[1] ).
					mul( mx4Rots[0] );
		},
		
		walk:	function( speed ){
			
			// 変換行列作成
			this.calcRotMtx();
			
			// 各ローカル基準点の変換
			this.BodyPos = this.localMtx.mulVec( this.BodyPlace[0], this.BodyPlace[1], this.BodyPlace[2], this.BodyPlace[3] );
			this.HeadPos = this.localMtx.mulVec( this.HeadPlace[0], this.HeadPlace[1], this.HeadPlace[2], this.HeadPlace[3] );
			this.FacePos = this.localMtx.mulVec( this.FacePlace[0], this.FacePlace[1], this.FacePlace[2], this.FacePlace[3] );
			
			// 歩行
			if(( this.brain.MainCmd === CmdMvFwd )||( this.brain.MainCmd === CmdMvBack )){
				const vel = ( this.brain.MainCmd === CmdMvBack )?(-speed):speed;
				this.pos = fDWL.add4D( this.pos, this.localMtx.mulVec( 0, 0, vel, 0 ) );
			}
			// 回転移動
			let rotAng = 0;
			if( this.brain.MainCmd === CmdMvTurnR ){
				rotAng = ROT_RATE;
				this.rot[5] += ROT_RATE;
				if( this.rot[5] < 0 ){
					this.rot[5] += Math.PI*2;
				}
			}else
			if( this.brain.MainCmd === CmdMvTurnL ){
				this.rot[5] -= ROT_RATE;
				if( this.rot[5] > Math.PI*2 ){
					this.rot[5] -= Math.PI*2;
				}
				rotAng = -ROT_RATE;
			}
			this.Body.walk( fDWL.add4D( this.pos, this.BodyPos ), this.rot );
			this.Head.walk( fDWL.add4D( this.pos, this.HeadPos ), this.rot );
			this.Face.walk( fDWL.add4D( this.pos, this.FacePos ), this.rot );
			
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].walk( this.LegPlace[idx], this.localMtx, this.pos, this.rot.concat(), speed );
			}
		},
		
		draw:	function( isRedraw, hPos, viewProjMtx, shaderParam ){
			if( isRedraw ){
				this.Body.transform();
				this.Body.dividePylams( hPos );
			}
			this.Head.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Head.draw( this.shader );
			this.Face.prepDraw( hPos, viewProjMtx, shaderParam );
			this.Face.draw( this.shader );
			for( let idx = 0; idx < LEG_NUM; ++idx ){
				this.Legs[idx].draw( isRedraw, hPos, this.localMtx, viewProjMtx, shaderParam );
			}
		}
	}
	
	let Walker = new WalkerOne( gl, walkerInitPos.concat(), walkerInitRot.concat(), triangleShader, LegBrain );
	Walker.initParts( TriBuffer );
	
	Walker.setResetParam({
		pos:	walkerInitPos,
		rotate:	walkerInitRot,
		isReset: function(){
			
			return false;
		}
	});
	Walker.setIsReset( function( isReset ){
		
		return isReset;
	});
	
	// テクスチャ無し地面
	EquinoxFloor.Data = fDWL.tiledFloor( 1.0, 16, [0.1, 0.1, 0.1, 1.0], [1.0, 1.0, 1.0, 1.0 ] );
	EquinoxFloor.VboList = [
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.p ),
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.n ),
		fDWL.WGL.createVbo( gl, EquinoxFloor.Data.c )
	];
	EquinoxFloor.Ibo = fDWL.WGL.createIbo( gl, EquinoxFloor.Data.i );
	
	// ビューxプロジェクション座標変換行列
	mat4.lookAt( views.eyePosition, views.lookAt, [0, 1, 0], viewMatrix);
	mat4.perspective(45, cnvs.width / cnvs.height, 0.1, 100, projMatrix);
	mat4.multiply(projMatrix, viewMatrix, vepMatrix);
    
	// Depth Test
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);

	// cntrls
	cntrls.nbrOfFramesForFps = 0;
	cntrls.prevFrameTimeStamp = Date.now();
	cntrls.fpsCounter = document.getElementById("fps");
	cntrls.eHPos = document.getElementById('H_Pos');
	cntrls.eHPosBox = document.getElementById('H_PosTxt');
	cntrls.oldHPos = (-100);
	cntrls.oldHPosBox = cntrls.eHPos.value;
	
	cntrls.wkrPos = [ 0,0,0,0 ];
	
	draw();
	
	// 恒常ループ
	function draw(){
		"use strict";
		let	texAndRate = [],
			hPos = 0,
			eyeRad = 0,
			currentTime = 0,
			fldPos = [],
			fldAng = [],
			collisionId = 0;
		
		// 現在のフレーム数を表示
		cntrls.requestId = requestAnimationFrame( draw );
		currentTime = Date.now();
		if( currentTime - cntrls.prevFrameTimeStamp >= 1000 ){
			cntrls.fpsCounter.innerHTML = cntrls.nbrOfFramesForFps;
			cntrls.nbrOfFramesForFps = 0;
			cntrls.prevFrameTimeStamp = currentTime;
		}
		
		// 視点調整：Walkerの方を向く
		(function(){
			const posW = Walker.getPos();
			views.lookAt[0] = posW[0];
			views.lookAt[1] = views.height;
			views.lookAt[2] = posW[2];
			const difX = posW[0]-views.eyePosition[0];
			const difZ = posW[2]-views.eyePosition[2]
			// 視点調整：Walkerとの距離を離されない
			let distV = Math.sqrt( difX*difX + difZ*difZ );
			const stdDist = 10;	// 基準距離
			if( distV > stdDist ){
				let rate = 1-stdDist/distV;
				views.eyePosition[0] += difX*rate;
				views.eyePosition[2] += difZ*rate;
			}
			// 左右キーで視点を回転
			let viewRot = 0;
			const VIEW_ROT = 0.02;
			if( keyStatus[2] ){	// left
				viewRot -= VIEW_ROT;
			}else
			if( keyStatus[3] ){	// right
				viewRot += VIEW_ROT;
			}
			if( viewRot ){
				// 視点位置を回転
				const sinR = Math.sin( viewRot );
				const cosR = Math.cos( viewRot );
				const tmpX = cosR * difX - sinR * difZ;
				const tmpZ = sinR * difX + cosR * difZ;
				views.eyePosition[0] += tmpX - difX;
				views.eyePosition[2] += tmpZ - difZ;
			}
			
			// 視点行列を算出
			mat4.lookAt( views.eyePosition, views.lookAt, [0, 1, 0], viewMatrix);
			mat4.multiply( projMatrix, viewMatrix, vepMatrix );
		}());
		
		// 入力ボックス：変更適用
//		let isRedraw = false;
		let isRedraw = true;
		if( cntrls.eHPos.value !== cntrls.oldHPos ){
			cntrls.eHPosBox.value = cntrls.eHPos.value;
		}else
		if( cntrls.eHPosBox.value !== cntrls.oldHPosBox ){
			cntrls.eHPos.value = cntrls.eHPosBox.value;
		}
/*
		if( cntrls.RotXY.old !== cntrls.RotXY.value ){
			cntrls.RotXYTxt.value = cntrls.RotXY.value;
		}else
		if( cntrls.RotXYTxt.old !== cntrls.RotXYTxt.value ){
			cntrls.RotXY.value = cntrls.RotXYTxt.value;
		}
		if( cntrls.RotYZ.old !== cntrls.RotYZ.value ){
			cntrls.RotYZTxt.value = cntrls.RotYZ.value;
		}else
		if( cntrls.RotYZTxt.old !== cntrls.RotYZTxt.value ){
			cntrls.RotYZ.value = cntrls.RotYZTxt.value;
		}
		if( cntrls.RotYH.old !== cntrls.RotYH.value ){
			cntrls.RotYHTxt.value = cntrls.RotYH.value;
		}else
		if( cntrls.RotYHTxt.old !== cntrls.RotYHTxt.value ){
			cntrls.RotYH.value = cntrls.RotYHTxt.value;
		}
		if( cntrls.RotZH.old !== cntrls.RotZH.value ){
			cntrls.RotZHTxt.value = cntrls.RotZH.value;
		}else
		if( cntrls.RotZHTxt.old !== cntrls.RotZHTxt.value ){
			cntrls.RotZH.value = cntrls.RotZHTxt.value;
		}
		if( cntrls.RotXH.old !== cntrls.RotXH.value ){
			cntrls.RotXHTxt.value = cntrls.RotXH.value;
		}else
		if( cntrls.RotXHTxt.old !== cntrls.RotXHTxt.value ){
			cntrls.RotXH.value = cntrls.RotXHTxt.value;
		}
		if( cntrls.RotXZ.old !== cntrls.RotXZ.value ){
			cntrls.RotXZTxt.value = cntrls.RotXZ.value;
		}else
		if( cntrls.RotXZTxt.old !== cntrls.RotXZTxt.value ){
			cntrls.RotXZ.value = cntrls.RotXZTxt.value;
		}
		if( cntrls.Dist.old !== cntrls.Dist.value ){
			isRedraw = true;
			cntrls.DistTxt.value = cntrls.Dist.value;
		}else
		if( cntrls.DistTxt.old !== cntrls.DistTxt.value ){
			isRedraw = true;
			cntrls.Dist.value = cntrls.DistTxt.value;
		}
*/
		
		// H軸位置設定
		hPos = cntrls.eHPos.value*(0.01);
		
/*
		// 真４Ｄオブジェクトの更新：非移動時のみ
		if( ( cntrls.RotXY.old !== cntrls.RotXY.value )||
			( cntrls.RotYZ.old !== cntrls.RotYZ.value )||
			( cntrls.RotYH.old !== cntrls.RotYH.value )||
			( cntrls.RotZH.old !== cntrls.RotZH.value )||
			( cntrls.RotXH.old !== cntrls.RotXH.value )||
			( cntrls.RotXZ.old !== cntrls.RotXZ.value )
		){
			cntrls.oldHPos = (-100);
		}
*/
		// 現在値記録
		cntrls.oldHPosBox = cntrls.eHPosBox.value;
/*
		cntrls.RotXY.old = cntrls.RotXY.value;
		cntrls.RotYZ.old = cntrls.RotYZ.value;
		cntrls.RotYH.old = cntrls.RotYH.value;
		cntrls.RotZH.old = cntrls.RotZH.value;
		cntrls.RotXH.old = cntrls.RotXH.value;
		cntrls.RotXZ.old = cntrls.RotXZ.value;
		cntrls.Dist.old = cntrls.Dist.value;
		cntrls.RotXYTxt.old = cntrls.RotXYTxt.value;
		cntrls.RotYZTxt.old = cntrls.RotYZTxt.value;
		cntrls.RotYHTxt.old = cntrls.RotYHTxt.value;
		cntrls.RotZHTxt.old = cntrls.RotZHTxt.value;
		cntrls.RotXHTxt.old = cntrls.RotXHTxt.value;
		cntrls.RotXZTxt.old = cntrls.RotXZTxt.value;
		cntrls.DistTxt.old = cntrls.DistTxt.value;
		if(( moveXZ.vel != 0 )||( cntrls.oldHPos != cntrls.eHPos.value )){
			isRedraw = true;
		}
*/
		// 現hPos値の記録
		cntrls.oldHPos = cntrls.eHPos.value;
		
		// canvasを初期化
		gl.clearColor(0.8, 0.8, 1.0, 1.0);
		gl.clearDepth( 1.0 );
		gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
		
		// ビューポート調整
		gl.viewport( 0.0, 0.0, cnvs.width, cnvs.height );
		
		gl.enable(gl.CULL_FACE);
		
		// 地面
		(function(){
			"use strict";
			var vbo = [],
				attL = [],
				attS = [];
			// Walkerに合わせて位置補正
			const posWk = Walker.getPos();
			floorPos[0] = Math.floor( posWk[0]/2 )*2;
			floorPos[2] = Math.floor( posWk[2]/2 )*2;
			
			mat4.identity( modelMatrix );
			//mat4.translate( modelMatrix, [0.0, 0.0, 0.0], modelMatrix );
			mat4.translate( modelMatrix, floorPos, modelMatrix );
			mat4.multiply( vepMatrix, modelMatrix, mvpMatrix );
			mat4.inverse( modelMatrix, invMatrix);
			triangleShader.setProgram( [ modelMatrix, mvpMatrix, invMatrix, light00.position, views.eyePosition, light00.ambient ] );
			
			vbo = EquinoxFloor.VboList;
			attL = triangleShader.attrLoc;
			attS = triangleShader.attrStride;
			for( var idx in vbo ){
				gl.bindBuffer(gl.ARRAY_BUFFER, vbo[idx]);
				gl.enableVertexAttribArray(attL[idx]);
				gl.vertexAttribPointer(attL[idx], attS[idx], gl.FLOAT, false, 0, 0);
			}
			gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, EquinoxFloor.Ibo );
			gl.drawElements( gl.TRIANGLES, EquinoxFloor.Data.i.length, gl.UNSIGNED_SHORT, 0 );
		}());
		
		// LegBrain
		let isReset = false;
		// 移動テスト用キー入力判定 5b,6f,7_,8p,9r
		const cmd = LegBrain.MainCmd;
		if(( keyStatus[0] )&&( !keyBackup[0] )){	// forward
			LegBrain.rcvCmd( CmdMvFwd, CmdListOut );
		}
		if(( keyStatus[1] )&&( !keyBackup[1] )){	// back
			LegBrain.rcvCmd( CmdMvBack, CmdListOut );
		}
		if(( keyStatus[7] )&&( !keyBackup[7] )){	// ' '
			LegBrain.rcvCmd( CmdMvStop, CmdListOut );
		}
		if(( keyStatus[8] )&&( !keyBackup[8] )){	// 'r'
			isReset = true;
		}
		
		// 視野からはみ出たときの処理
		const wkPos = Walker.getPos();
		const ViewOffset = 2.6;
		if( wkPos[3] < hPos-ViewOffset ){
			LegBrain.rcvCmd( CmdMvFwd, CmdListOut );
		}else
		if( wkPos[3] > hPos+ViewOffset ){
			LegBrain.rcvCmd( CmdMvBack, CmdListOut );
		}
		
		keyBackup = keyStatus.concat();
		LegBrain.checkCmdList();
		
		if( Walker.isReset( isReset ) ){
			Walker.resetPos();
			views.eyePosition = [ 0,  SIGHT_HEIGHT, SIGHT_LENGTH*2 ];
			views.lookAt = [ 0, 0, -4 ];
			return;
		}
		
		if(( cntrls.wkrPos[0] !== Walker.pos[0] )||( cntrls.wkrPos[1] !== Walker.pos[1] )||( cntrls.wkrPos[2] !== Walker.pos[2] )||( cntrls.wkrPos[3] !== Walker.pos[3] )){
			isRedraw = true;
			cntrls.wkrPos = Walker.pos.concat();
		}
		Walker.walk( VELOCITY );
		if( isRedraw ){
			// 八胞体切断体の作成
			TriBuffer.initialize( triangleShader );
		}
		Walker.draw( isRedraw, hPos, vepMatrix, [ 0, 0, 0, light00.position, views.eyePosition, light00.ambient ] );
		
		// 三角バッファの描画
		gl.disable(gl.CULL_FACE);
		TriBuffer.useProgram( triangleShader );
		mat4.identity( modelMatrix );
		mat4.inverse( modelMatrix, invMatrix);
		mat4.multiply( vepMatrix, modelMatrix, mvpMatrix );
		triangleShader.setUniLoc(
			mvpMatrix, invMatrix, light00.position, views.eyePosition, light00.ambient
		);
		TriBuffer.draw();
		
		// コンテキストの再描画
		gl.flush();
		
		cntrls.nbrOfFramesForFps++;
	}
	
	// 衝突判定による位置調整を行う
	function checkCollision( viewPos, moveXZ ){
		"use strict";
		var pos = [];
		
		pos[0] = viewPos[0]+moveXZ.dif[0];	// 
		pos[2] = viewPos[2]+moveXZ.dif[1];	// 移動先で判定
		
		if(( pos[0] < -8 )||( 8 < pos[0] )){
			moveXZ.dif[0] = 0;
		}
		if(( pos[2] < -8 )||( 8 < pos[2] )){
			moveXZ.dif[1] = 0;
		}
	};
	
	// プログラムオブジェクトとシェーダを生成しリンクする関数
	function createShaderProgram( gl, vsId, fsId ){
		"use strict";
		let shader = [],
			scriptElement = [ document.getElementById(vsId), document.getElementById(fsId) ];
		
		if(( !scriptElement[0] )||( !scriptElement[1] )){
			return;
		}
		if(( scriptElement[0].type === 'x-shader/x-vertex' )&&( scriptElement[1].type === 'x-shader/x-fragment' )){
			shader[0] = gl.createShader(gl.VERTEX_SHADER);
			shader[1] = gl.createShader(gl.FRAGMENT_SHADER);
		}else{
			return;
		}
		for( let cnt = 0; cnt < 2; ++cnt ){
			gl.shaderSource(shader[cnt], scriptElement[cnt].text);
			gl.compileShader(shader[cnt]);
			if( !gl.getShaderParameter(shader[cnt], gl.COMPILE_STATUS) ){
				alert(gl.getShaderInfoLog(shader[cnt]));
				return;
			}
		}
		
		let program = gl.createProgram();
		gl.attachShader(program, shader[0]);
		gl.attachShader(program, shader[1]);
		gl.linkProgram(program);
		if( gl.getProgramParameter( program, gl.LINK_STATUS ) ){
			gl.useProgram(program);
			return program;
		}else{
			alert(gl.getProgramInfoLog(program));
			return;
		}
	};
	
	
	// ブラウザごとのキーイベント名称を取得
	function getKeyEventNames( browserInfo ){
		"use strict";
		let info = {
			up:		"ArrowUp",
			down:	"ArrowDown",
			left:	"ArrowLeft",
			right:	"ArrowRight",
			shift:	"Shift",
			ctrl:	"Control",
			space:	" ",
			keyB:	"b",
			keyF:	"f",
			keyG:	"g",
			keyP:	"p",
			keyR:	"r",
		};
		
		if( browserInfo[0] === "Microsoft Edge" ){
			info.up = "Up";
			info.down = "Down";
			info.left = "Left";
			info.right = "Right";
		}
		
		return info;
	};
};




