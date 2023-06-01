import EventEmitter from './EventEmitter.mjs'

/**
 * Main model that only holds the information really needed to update the UI. There's e.g. no
 * reason to store all materials or laser sources – but just the ones we filter by. Keep things
 * (very) simple here.
 * 
 * We might want to use multiple models to keep things together, e.g. the calculations of the
 * producitivity values' visibility (ProductivityValues as its own model or ProducitivityValuesView
 * as a "view model" instead of a main model that holds and does everything)
 */
class LaserSources {

    #productivityValues = [];
    #laserSourcesFilter = [];
    #materialFilter;

    addProductivityValue(productivityValue) {
        this.#productivityValues.push(productivityValue);
        console.log('add productivity value', productivityValue);
        this.#updateProductivityValues();
    }

    setMaterialsFilter(materialId) {
        this.#materialFilter = materialId;
        console.log('set material filter to', this.#materialFilter);
        this.#updateProductivityValues();
        this.emit('changeMaterialFilter');
    }

    updateLaserSourceFilter(laserSourceId, visible) {
        if (visible) {
            this.#laserSourcesFilter = [...this.#laserSourcesFilter, laserSourceId];
        } else {
            this.#laserSourcesFilter = this.#laserSourcesFilter
                .filter(item => item !== laserSourceId);
        }
        console.log('update laser source filter; is', this.#laserSourcesFilter);
        this.#updateProductivityValues();
        this.emit('changeLaserSourcesFilter');
    }

    /**
     * Meh: In order to not calculate the visibility whenever it is requested in our custom
     * elements, let's do it here and update the models. This also allows us to store their
     * relative production value (%) which is required by other elements to set their width
     * accordingly.
     * We should/might use view models instead and calculate those values there on the fly while
     * preserving the values through memoization or something.
     */
    #updateProductivityValues() {

        const visibleProductivityValues = this.#productivityValues
            .filter(item => this.#laserSourcesFilter.includes(item.laserSourceId))
            .filter(item => this.#materialFilter === item.materialId);

            // Map with key: thickness and value: lowest productivity value that with the given
        // thickness that is currently visible
        const visibleMinimumProductivityValuesByThickness = visibleProductivityValues
            .reduce((prev, item) => {
                prev.set(
                    item.thickness,
                    Math.min(prev.get(item.thickness) || Infinity, item.value),
                );
                return prev;
            }, new Map());

            // Update every productivityValue with visible and relativeValue properties
        this.#productivityValues.forEach((item) => {
            item.isVisible = visibleProductivityValues.includes(item);
            item.relativeValue = item.value / visibleMinimumProductivityValuesByThickness.get(item.thickness);
        });

        // Get the highest relative value of all visible productivity values, then use it to
        // set every productivity value's relative width accordingly
        const highestRelativeVisibleProductivityValue = Math.max(
            ...visibleProductivityValues.map(item => item.relativeValue)
        );
        this.#productivityValues.forEach((item) => {
            item.relativeWidth = item.relativeValue / highestRelativeVisibleProductivityValue;
        });
        console.log('updated productivity values', this.#productivityValues);

    }

    /**
     * Expose laserSourcesfilter to read operations; but make sure it cannot be modified from the
     * outside.
     */
    get laserSourcesFilter() {
        return this.#laserSourcesFilter;
    }

}

Object.assign(LaserSources.prototype, EventEmitter);

export default LaserSources;
