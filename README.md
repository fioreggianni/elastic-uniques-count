# elastic-uniques-count
An experimental fallbacking algorithm: from linear unique elements count to sublinear Flajolet-Martin for IP tracking.

*A fallbacking elastic algorithm is an elastic algorithm able to switch from linear to sublinear space at runtime (changing algorithm), and able to later keep reducing space more and more at runtime, compromising on accuracy.*

`DEMO=true MEMORY=2000 STARTMODE=exact ITERATIONS=200000 IPS=1500 npm run test` to generate 1500 IPs distributed within 200k entries. Algorithm will start with trivial algorthm (save in dict to check for set membership) and fallback to Flajolet-Martin when it reaches full memory (2000 bytes. An IP takes 4 bytes, so up to 500 different IP entries, then fallbacks to Flajolet-Martin). 

Using `consumer.memory(500)` you can change at runtime the memory used from the algorithm, it will adapt the algorithm accuracy to match new memory space requirements. That's my idea of Elastic Algorithms.

![A demo: execution compared with real results](output/flajomartin.JPG?raw=true "Demo")

