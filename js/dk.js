/*global THREE getClass*/
var DFK= (function()
{
    var df = {};
    
    /// Geometric Section
    
    // create a new vector
    df.v3 = function(x, y, z) { return new THREE.Vector3(x, y, z); };
    
    // return a copy of the vector
    df.v3cpy =  function (v) { return df.v3(v.x, v.y, v.z); };
    
    // return v1 + v2
    df.v3add = function (v1, v2) { return df.v3(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z )};
    
    // return v1 - v2
    df.v3sub = function (v1, v2) { return df.v3(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z )};
    
    // return the root
    df.v3len2 = function (v) { return v.x*v.x + v.y*v.y + v.z*v.z; };
    
    // return the len of v
    df.v3len = function (v) { return Math.sqrt(df.v3len2(v)); };
    
    // return the distance between 2 position
    df.v3dist = function (v1, v2) { return df.v3len(df.v3sub(v2, v1)) };
    
    // return a new vector equal to k*v
    df.v3mul = function(k, v) { return df.v3(k*v.x, k*v.y, k*v.z); };
    
    // multily each component of v by k i.e. v = k*v
    df.v3mul_inplace = function(k, v) { v.x *= k; v.y *=k; v.z *= k; };
    
    // Return a new unit vector from v. return v/||v||
    df.v3unit = function (v) {
        var len = df.v3len(v);  
        return df.v3mul(1/len, v);
        };
        
    // modify v to make it a unit unit vector. ||v|| = 1
    df.v3united = function (v) {
        var len = df.v3len(v);  
        return df.v3mul_inplace(1/len, v);
        };
    
    
    /// Physics Section
    
    // Gravity force
    df.P = df.v3(0, -9.81, 0);
    
    // second newton law, given a mass, a force F, an initial velocity and position at t = 0
    // Return the position at the date t.
    df.newton = function(m, F, v0, p0, t) {
        var t2 = t*t;
        
        var p = df.v3(0,0,0);
        p.x = 0.5*m*F.x*t2 + v0.x * t + p0.x;
        p.y = 0.5*m*F.y*t2 + v0.y * t + p0.y;
        p.z = 0.5*m*F.z*t2 + v0.z * t + p0.z;
        return p;
    }
    
    /// Utilities Section
    
    // Return a random number in the range [from; to[
    df.rnd = function (from, to) {
            var rnd = Math.random();
            return from + rnd * (to - from);
        };
        
    // Return true if the object is a function
    df.isFunction = function(object) {
        return object && getClass.call(object) == '[object Function]';
    }
        
    // Simple Factory Implementation
    df.Factory = function(){
        var d = {};
        var keys =  [];
        var values =  [];
        
        d.add = function(key, object) {
            keys.push(key);
            values.push(object);
        };
        
        d.create = function(key) {
            var idx = keys.indexOf(key);
            return values[idx];
        };
        
        d.contains = function(key) {
          var idx = keys.indexOf(key);
          return idx != -1;
        };
        return d;
    };
    
    // Particules Section
    
    df.particule = function(m, F) {
        var d = {};
        d.is_dead = true;
        d.p = df.v3(0,0,0);
        d.v = df.v3(0,0,0);
        d.m = m;
        d.F = F;
        
        d.reset = function(p0, v0) {
            d.v.copy(v0);
            d.p.copy(p0);
            d.t = 0;
            d.is_dead = false;
        }
        d.next = function(dt) {
            console.log(d.is_dead);
            if(d.is_dead)
            {
                d.onDie(d);
            }
            d.t += dt;
            if(!d.is_dead)
            {
                d.p = df.newton(d.m, d.F, d.v, d.p, d.t); 
                d.is_dead = d.shouldDie(d.p);
            }
            return d.p;
        }
        return d;
    }
    
    
    return df;
})(DFK||{});